export type LoopType = "interval" | "cron" | "once" | "event";
export type LoopStatus = "active" | "paused" | "failed";

export interface Loop {
  id: string;
  doo_id: number;
  type: LoopType;
  interval_ms: number | null;
  cron_expr: string | null;
  payload: any | null;
  target_path: string;       // Which endpoint to trigger
  end_expression: string | null; // Optional condition to stop the loop
  status: LoopStatus;
  last_run_at: string | null;
  next_run_at: string | null;
  retries: number;
  max_retries: number;
  created_at: string;
  updated_at: string;
}

export interface LoopLog {
  id: string;
  loop_id: string;
  status: "success" | "failed";
  duration_ms: number;
  response_body: string | null;
  error_message: string | null;
  run_at: string;
}

export interface CreateLoopDTO {
  doo_id: number;
  type: LoopType;
  interval_ms?: number;
  cron_expr?: string;
  payload?: any;
  target_path: string;
  end_expression?: string;
  max_retries?: number;
}

export interface UpdateLoopDTO {
  type?: LoopType;
  interval_ms?: number;
  cron_expr?: string;
  payload?: any;
  status?: LoopStatus;
  max_retries?: number;
  target_path?: string;
  end_expression?: string;
}
