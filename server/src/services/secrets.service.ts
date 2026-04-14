import { secretsRepository } from "@/repositories/secrets.repository";
import { type ProjectSecret } from "@/db/types";
import { NotFoundError } from "@/lib/error";

// SCREAMING_SNAKE_CASE validator
const SECRET_NAME_RE = /^[A-Z][A-Z0-9_]*$/;

export class SecretsService {
  private validateName(name: string) {
    if (!SECRET_NAME_RE.test(name)) {
      throw new Error(
        `Secret name "${name}" is invalid. Must be SCREAMING_SNAKE_CASE (e.g. MY_SECRET).`
      );
    }
  }

  async list(userId: number): Promise<ProjectSecret[]> {
    return secretsRepository.list(userId);
  }

  async set(userId: number, name: string, value: string): Promise<ProjectSecret> {
    this.validateName(name);
    return secretsRepository.set(userId, name, value);
  }

  async delete(userId: number, name: string): Promise<{ deleted: boolean }> {
    const deleted = await secretsRepository.delete(userId, name);
    if (!deleted) throw new NotFoundError(`Secret "${name}" not found`);
    return { deleted };
  }

  async getAsMap(userId: number): Promise<Record<string, string>> {
    return secretsRepository.getAsMap(userId);
  }
}

export const secretsService = new SecretsService();
