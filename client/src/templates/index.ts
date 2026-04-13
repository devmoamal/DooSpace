import { Zap, Database, Palette, Webhook, Activity } from "lucide-react";
import { starter } from "./starter";
import { database } from "./database";
import { canvas } from "./canvas";
import { webhook } from "./webhook";
import { monitor } from "./monitor";

export interface DooTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  code: string;
}

export const DOO_TEMPLATES: DooTemplate[] = [
  {
    id: "starter",
    name: "Starter Kit",
    description: "Simple API with logging and basic GET endpoint.",
    icon: Zap,
    code: starter
  },
  {
    id: "database",
    name: "User Database",
    description: "CRUD patterns with typed requests and structured storage.",
    icon: Database,
    code: database
  },
  {
    id: "canvas",
    name: "Pixel Canvas",
    description: "Visual rendering using the pixel engine for real-time output.",
    icon: Palette,
    code: canvas
  },
  {
    id: "webhook",
    name: "Webhook Handler",
    description: "Listen for external events and persist payloads for analysis.",
    icon: Webhook,
    code: webhook
  },
  {
    id: "monitor",
    name: "System Health",
    description: "Multi-endpoint monitoring with hit tracking and uptime.",
    icon: Activity,
    code: monitor
  }
];
