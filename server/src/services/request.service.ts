import { requestRepository } from "@/repositories/request.repository";
import { type PaginatedResponse, type PaginationQuery } from "@doospace/shared";

export class RequestService {
  async getAllLogs(query: PaginationQuery): Promise<PaginatedResponse<any>> {
    const { page, limit } = query;
    const { data, total } = await requestRepository.findPaginated(page, limit);

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

  async getLogsByDooId(dooId: number, query: PaginationQuery): Promise<PaginatedResponse<any>> {
    const { page, limit } = query;
    const { data, total } = await requestRepository.findPaginatedByDooId(dooId, page, limit);

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
}

export const requestService = new RequestService();
