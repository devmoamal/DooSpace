export interface Page {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface PageMessage {
  id: number;
  page_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface CreatePageDto {
  name: string;
}

export interface UpdatePageCodeDto {
  html?: string;
  css?: string;
  js?: string;
}

export interface PageChatRequest {
  message: string;
}
