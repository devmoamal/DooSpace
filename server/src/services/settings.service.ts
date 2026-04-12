import { settingsRepository } from "@/repositories/settings.repository";

export class SettingsService {
  async getAllSettings() {
    return await settingsRepository.findAll();
  }

  async updateSetting(key: string, value: string) {
    return await settingsRepository.upsert(key, value);
  }

  async getSetting(key: string) {
    return await settingsRepository.findByKey(key);
  }
}

export const settingsService = new SettingsService();
