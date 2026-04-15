import { dooRepository } from "@/repositories/doo.repository";
import { extractEndpoints } from "@/lib/parser";
import { NotFoundError } from "@/lib/error";
import { type PaginatedResponse, type PaginationQuery } from "@doospace/shared";

export class DooService {
  async getAllDoos(query: PaginationQuery): Promise<PaginatedResponse<any>> {
    const { page, limit } = query;
    const { data, total } = await dooRepository.findPaginated(query);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async getDooById(id: number) {
    const doo = await dooRepository.findById(id);

    if (!doo) throw new NotFoundError("Doo not found");
    return doo;
  }

  async createDoo(data: { name: string; description?: string; code: string; owner_id: number }) {
    const endpoints = extractEndpoints(data.code);
    return await dooRepository.create({
      ...data,
      endpoints,
    });
  }

  async updateDoo(id: number, data: { name?: string; description?: string; code?: string }) {
    const updateData: any = { ...data };
    
    if (data.code) {
      updateData.endpoints = extractEndpoints(data.code);
    }

    const updatedDoo = await dooRepository.update(id, updateData);
    if (!updatedDoo) throw new NotFoundError("Doo not found");
    return updatedDoo;
  }

  async deleteDoo(id: number) {
    const deletedDoo = await dooRepository.delete(id);

    if (!deletedDoo) throw new NotFoundError("Doo not found");
    return deletedDoo;
  }

  async toggleActiveStatus(id: number) {
    const doo = await this.getDooById(id);
    const updatedDoo = await dooRepository.update(id, {
      is_active: !doo.is_active,
    });
    if (!updatedDoo) throw new NotFoundError("Doo not found");
    return updatedDoo;
  }
}


export const dooService = new DooService();
