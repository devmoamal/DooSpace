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
import { secretsService } from "./secrets.service";
import { requestService } from "./request.service";
import { pageService } from "./page.service";
import { dooboxService } from "./doobox.service";

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

  async chat(
    messages: any[],
    context?: {
      page_id?: string;
      current_code?: { html: string };
    },
  ) {
    const model = await this.getClient();

    const tools = [
      new DynamicStructuredTool({
        name: "read_doo_list",
        description:
          "List all Doos with pagination. Returns names, IDs, and descriptions.",
        schema: z.object({
          page: z.number().default(1).describe("The page number"),
          limit: z.number().default(20).describe("Number of items per page"),
        }),
        func: async ({ page, limit }: { page: number; limit: number }) => {
          const result = await dooService.getAllDoos({ page, limit });
          return JSON.stringify({
            doos: result.data.map((d) => ({
              id: d.id,
              name: d.name,
              description: d.description,
              active: d.is_active,
            })),
            meta: result.meta,
          });
        },
      }),
      new DynamicStructuredTool({
        name: "read_doo",
        description:
          "Read a specific Doo's code, endpoints, and metadata by ID.",
        schema: z.object({
          id: z.number().describe("The ID of the Doo to read"),
        }),
        func: async ({ id }: { id: number }) => {
          const doo = await dooService.getDooById(id);
          return JSON.stringify({
            id: doo.id,
            name: doo.name,
            description: doo.description,
            code: doo.code,
            endpoints: doo.endpoints,
            active: doo.is_active,
          });
        },
      }),
      new DynamicStructuredTool({
        name: "create_doo",
        description: "Create a new Doo unit.",
        schema: z.object({
          name: z.string().describe("The name of the new Doo"),
          description: z
            .string()
            .optional()
            .describe("Short description of what it does"),
          code: z.string().describe("The TypeScript code for the Doo"),
        }),
        func: async ({
          name,
          description,
          code,
        }: {
          name: string;
          description?: string;
          code: string;
        }) => {
          const result = await dooService.createDoo({
            name,
            description,
            code,
            owner_id: 1, // Default user
          });
          return `Doo '${name}' created successfully with ID: ${result.id}`;
        },
      }),
      new DynamicStructuredTool({
        name: "update_doo",
        description: "Update an existing Doo's name, description, or code.",
        schema: z.object({
          id: z.number().describe("The ID of the Doo to update"),
          name: z.string().optional().describe("New name"),
          description: z.string().optional().describe("New description"),
          code: z.string().optional().describe("New TypeScript code"),
        }),
        func: async ({
          id,
          name,
          description,
          code,
        }: {
          id: number;
          name?: string;
          description?: string;
          code?: string;
        }) => {
          await dooService.updateDoo(id, { name, description, code });
          return `Doo ${id} updated successfully.`;
        },
      }),
      new DynamicStructuredTool({
        name: "call_doo",
        description: "Manually execute a Doo endpoint.",
        schema: z.object({
          id: z.number().describe("The ID of the Doo to execute"),
          path: z.string().describe("The path to call (e.g. /)"),
          method: z
            .enum(["GET", "POST", "PUT", "DELETE"])
            .describe("The HTTP method"),
          body: z.any().optional().describe("The JSON body for the request"),
        }),
        func: async ({ id, path, method, body }: any) => {
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
        name: "read_doo_requests",
        description:
          "Read recent request logs for a specific Doo with pagination.",
        schema: z.object({
          doo_id: z.number().describe("The ID of the Doo"),
          page: z.number().default(1).describe("The page number"),
          limit: z.number().default(20).describe("Number of items per page"),
        }),
        func: async ({ doo_id, page, limit }: any) => {
          const result = await requestService.getLogsByDooId(doo_id, {
            page,
            limit,
          });
          return JSON.stringify(result);
        },
      }),
      new DynamicStructuredTool({
        name: "read_doobox",
        description:
          "Read persistent storage (DooBox) for a specific Doo with pagination.",
        schema: z.object({
          doo_id: z.number().describe("The ID of the Doo"),
          page: z.number().default(1).describe("The page number"),
          limit: z.number().default(20).describe("Number of items per page"),
        }),
        func: async ({ doo_id, page, limit }: any) => {
          const result = await dooboxService.getPaginated(doo_id, {
            page,
            limit,
          });
          return JSON.stringify(result);
        },
      }),
      new DynamicStructuredTool({
        name: "read_secrets_list",
        description:
          "List names of all configured secrets. Values are not returned for security.",
        schema: z.object({}),
        func: async () => {
          const secrets = await secretsService.list(1);
          return JSON.stringify(secrets.map((s) => s.name));
        },
      }),
      new DynamicStructuredTool({
        name: "create_secret",
        description: "Create or update a secret.",
        schema: z.object({
          name: z.string().describe("Secret name (SCREAMING_SNAKE_CASE)"),
          value: z.string().describe("Secret value"),
        }),
        func: async ({ name, value }: any) => {
          await secretsService.set(1, name, value);
          return `Secret ${name} saved successfully.`;
        },
      }),
      new DynamicStructuredTool({
        name: "create_loop",
        description:
          "Create an automation loop to run a Doo endpoint on an interval.",
        schema: z.object({
          doo_id: z.number().describe("Doo ID to automate"),
          target_path: z.string().describe("Endpoint path to call"),
          interval_ms: z.number().describe("Interval in milliseconds"),
          payload: z.any().optional().describe("JSON payload for the requests"),
        }),
        func: async (data: any) => {
          const result = await loopService.createLoop({
            ...data,
            payload: JSON.stringify(data.payload || {}),
            type: "interval",
            status: "active",
            max_retries: 3,
          } as any);
          return `Loop created successfully with ID: ${result.id}`;
        },
      }),
      new DynamicStructuredTool({
        name: "stop_loop",
        description: "Stop/Pause a running loop.",
        schema: z.object({
          loop_id: z.string().describe("The UUID of the loop"),
        }),
        func: async ({ loop_id }: { loop_id: string }) => {
          await loopService.updateLoop(loop_id, { status: "paused" });
          return `Loop ${loop_id} paused.`;
        },
      }),
      new DynamicStructuredTool({
        name: "run_loop",
        description: "Manually trigger a loop execution immediately.",
        schema: z.object({
          loop_id: z.string().describe("The UUID of the loop"),
        }),
        func: async ({ loop_id }: { loop_id: string }) => {
          await loopService.triggerLoop(loop_id);
          return `Loop ${loop_id} triggered. Check logs for results.`;
        },
      }),
      new DynamicStructuredTool({
        name: "upsert_page_code",
        description:
          "Update the UI of the current page. Provide full HTML (including Tailwind CSS via CDN if needed).",
        schema: z.object({
          html: z.string().describe("The full HTML content of the page"),
        }),
        func: async ({ html }: { html: string }) => {
          if (!context?.page_id) return "Error: No page context found.";
          await pageService.updatePageCode(context.page_id, { html });
          return "Page UI updated successfully.";
        },
      }),
    ];

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are the DooSpace V0 Architect, an elite AI design and orchestration agent. You build modern, high-performance web applications and serverless backends with surgical precision.

### UI DESIGN (PAGES)
- Pages use standard HTML.
- ALWAYS use Tailwind CSS via CDN for styling: <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
- Focus on premium, dark-mode-first, high-fidelity aesthetics.
- When asked to build a UI, generate the COMPLETE HTML in one go.

### BACKEND LOGIC (DOOS)
Always use the functional export pattern:
\`\`\`typescript
import { doobox, callDoo, secrets } from "doospace";

export default function (doo: Doo) {{
  doo.get("/", async (req) => {{
    doo.log("Accessing root");
    const key = secrets.API_KEY;

    const data = await doobox.get("key");
    return {{ ok: true, data }};
  }});
}}
\`\`\`

Available Globals:
- \`secrets\`: \`ANY_CONST_IN_SECRETS\`
- \`doo\`: \`get/post/put/delete/patch\`, \`log(msg)\`
- \`doobox\`: \`get(k)\`, \`set(k, v)\`, \`delete(k)\`, \`list()\`
- \`callDoo\`: \`get(id, path)\`, \`post(id, path, body)\`

### WORKFLOW
1. If the user asks for a UI, use 'upsert_page_code'.
2. If the user asks for logic/backend, use 'create_doo' or 'update_doo'.
3. Use 'call_doo' to test your implementations.

Current Page Context:
${
  context?.page_id
    ? `
- Page ID: ${context.page_id}
- Current HTML: ${context.current_code?.html || "Empty"}
`
    : "No page context."
}

Be brief, technical, and prioritize visual excellence.`,
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
