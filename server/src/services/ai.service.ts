import { ChatOpenAI } from "@langchain/openai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { dooService } from "./doo.service";
import { loopService } from "./loop.service";
import { executionService } from "./execution.service";
import { settingsService } from "./settings.service";
import { createToolCallingAgent, AgentExecutor } from "langchain/agents";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";

export class AIService {
  private async getClient() {
    const provider = await settingsService.getSetting("AI_PROVIDER");
    const apiKey = await settingsService.getSetting("AI_API_KEY");
    const model = await settingsService.getSetting("AI_MODEL");

    if (!apiKey?.value) {
      throw new Error("AI API Key not configured in settings");
    }

    // Support OpenAI and OpenAI-compatible providers
    const baseUrl =
      provider?.value === "openai"
        ? undefined
        : await settingsService.getSetting("AI_BASE_URL");

    return new ChatOpenAI({
      openAIApiKey: apiKey.value,
      modelName: model?.value || "gpt-4o",
      configuration: {
        baseURL: baseUrl?.value,
      },
      temperature: 0.2,
    });
  }

  getProviders() {
    return [
      { id: "openai", name: "OpenAI", baseUrl: "https://api.openai.com/v1" },
      { id: "groq", name: "Groq", baseUrl: "https://api.groq.com/openai/v1" },
      {
        id: "openrouter",
        name: "OpenRouter",
        baseUrl: "https://openrouter.ai/api/v1",
      },
      { id: "custom", name: "Custom OpenAI Compatible", baseUrl: "" },
    ];
  }

  async fetchModels(provider: string) {
    const apiKey = await settingsService.getSetting("AI_API_KEY");
    if (!apiKey?.value) throw new Error("API Key required to fetch models");

    let baseUrl = "";
    if (provider === "openai") baseUrl = "https://api.openai.com/v1";
    else if (provider === "groq") baseUrl = "https://api.groq.com/openai/v1";
    else if (provider === "openrouter")
      baseUrl = "https://openrouter.ai/api/v1";
    else {
      const customUrl = await settingsService.getSetting("AI_BASE_URL");
      if (!customUrl?.value) throw new Error("Custom Base URL required");
      baseUrl = customUrl.value;
    }

    const response = await fetch(`${baseUrl}/models`, {
      headers: { Authorization: `Bearer ${apiKey.value}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.map((m: any) => ({
      id: m.id,
      name: m.id,
    }));
  }

  async chat(messages: any[]) {
    const model = await this.getClient();

    const tools = [
      new DynamicStructuredTool({
        name: "list_doos",
        description: "List all Doos with their names, IDs, and descriptions.",
        schema: z.object({}),
        func: async (_input: z.infer<z.ZodObject<{}>>) => {
          const result = await dooService.getAllDoos({ page: 1, limit: 100 });
          return JSON.stringify(
            result.data.map((d) => ({
              id: d.id,
              name: d.name,
              description: d.description,
              active: d.is_active,
            })),
          );
        },
      }),
      new DynamicStructuredTool({
        name: "get_doo_source",
        description: "Get the source code of a specific Doo by ID.",
        schema: z.object({
          id: z.number().describe("The ID of the Doo to fetch"),
        }),
        func: async ({ id }: { id: number }) => {
          const doo = await dooService.getDooById(id);
          return JSON.stringify({ name: doo.name, code: doo.code });
        },
      }),
      new DynamicStructuredTool({
        name: "create_doo",
        description:
          "Create a new Doo with the provided name and TypeScript code.",
        schema: z.object({
          name: z.string().describe("The name of the new Doo"),
          code: z.string().describe("The TypeScript code for the Doo"),
        }),
        func: async ({ name, code }: { name: string; code: string }) => {
          const result = await dooService.createDoo({
            name,
            code,
            owner_id: 1,
          });
          return `Doo '${name}' created successfully with ID: ${result.id}`;
        },
      }),
      new DynamicStructuredTool({
        name: "delete_doo",
        description: "Delete a Doo by its ID.",
        schema: z.object({
          id: z.number().describe("The ID of the Doo to delete"),
        }),
        func: async ({ id }: { id: number }) => {
          await dooService.deleteDoo(id);
          return `Doo ${id} deleted successfully.`;
        },
      }),
      new DynamicStructuredTool({
        name: "execute_doo",
        description: "Execute a Doo endpoint.",
        schema: z.object({
          id: z.number().describe("The ID of the Doo to execute"),
          path: z.string().describe("The path to call (e.g. /)"),
          method: z
            .enum(["GET", "POST", "PUT", "DELETE"])
            .describe("The HTTP method"),
          body: z.any().optional().describe("The JSON body for the request"),
        }),
        func: async ({
          id,
          path,
          method,
          body,
        }: {
          id: number;
          path: string;
          method: string;
          body?: any;
        }) => {
          const req = new Request(`http://localhost${path}`, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: { "Content-Type": "application/json" },
          });
          const response = await executionService.executeDoo(
            id,
            method,
            path,
            req,
          );
          const text = await response.text();
          return `Status: ${response.status}. Response: ${text}`;
        },
      }),
      new DynamicStructuredTool({
        name: "manage_loops",
        description: "List or create loops for a Doo.",
        schema: z.object({
          action: z.enum(["list", "create"]).describe("Action to perform"),
          doo_id: z
            .number()
            .optional()
            .describe("Doo ID (required for create)"),
          target_path: z
            .string()
            .optional()
            .describe("Path to target (required for create)"),
          interval_ms: z
            .number()
            .optional()
            .describe("Interval in ms (required for create)"),
        }),
        func: async ({
          action,
          doo_id,
          target_path,
          interval_ms,
        }: {
          action: string;
          doo_id?: number;
          target_path?: string;
          interval_ms?: number;
        }) => {
          if (action === "list") {
            const result = await loopService.getAllLoops({
              page: 1,
              limit: 100,
            });
            return JSON.stringify(result.data);
          } else {
            if (!doo_id || !target_path || !interval_ms)
              return "Missing parameters for create";
            const result = await loopService.createLoop({
              doo_id,
              target_path,
              interval_ms,
              type: "interval",
              status: "active",
              max_retries: 3,
              payload: "{}",
            } as any);
            return `Loop created with ID: ${result.id}`;
          }
        },
      }),
    ];

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are the DooSpace Orchestrator, an AI agent designed to help users build and manage serverless 'Doos'. You can create, edit, delete, and execute Doos. Use tools to interact with the system. Always be technical and precise.",
      ],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);

    const agent = await createToolCallingAgent({
      llm: model as any,
      tools: tools as any,
      prompt: prompt as any,
    });

    const executor = new AgentExecutor({
      agent,
      tools: tools as any,
      verbose: true,
    });

    const history = messages
      .slice(0, -1)
      .map((m) =>
        m.role === "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content),
      );

    const input = messages[messages.length - 1].content;

    const result = await executor.invoke({
      input,
      chat_history: history,
    });

    return {
      content: result.output,
    };
  }
}

export const aiService = new AIService();
