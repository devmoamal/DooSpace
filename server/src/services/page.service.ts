import { pageRepository } from "@/repositories/page.repository";
import { aiService } from "./ai.service";
import { NotFoundError } from "@/lib/error";
import { type PageMessage } from "@doospace/shared";

export class PageService {
  async listPages(userId: number) {
    return pageRepository.list(userId);
  }

  async getPage(id: string) {
    const page = await pageRepository.findById(id);
    if (!page) throw new NotFoundError("Page not found");
    return page;
  }

  async createPage(userId: number, name: string) {
    return pageRepository.create({ name, owner_id: userId });
  }

  async deletePage(id: string) {
    return pageRepository.delete(id);
  }

  async getMessages(pageId: string) {
    return pageRepository.listMessages(pageId);
  }

  async chat(pageId: string, userMessage: string) {
    const page = await this.getPage(pageId);
    
    // 1. Persist user message
    await pageRepository.createMessage({
      page_id: pageId,
      role: "user",
      content: userMessage,
    });

    // 2. Fetch history
    const history = await pageRepository.listMessages(pageId);
    
    // We reverse it because repository returns desc by created_at
    const formattedHistory = history
      .reverse()
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    // 3. Call AI with specialized context for this page
    const aiResponse = await aiService.chat(formattedHistory, {
      page_id: pageId,
      current_code: {
        html: page.html,
      }
    });

    // 4. Persist AI response
    await pageRepository.createMessage({
      page_id: pageId,
      role: "assistant",
      content: aiResponse.content,
    });

    return aiResponse;
  }

  async updatePageCode(id: string, code: { html?: string }) {
    return pageRepository.updateCode(id, code);
  }
}

export const pageService = new PageService();
