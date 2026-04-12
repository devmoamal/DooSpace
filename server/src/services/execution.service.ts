import { requestRepository } from "@/repositories/request.repository";
import { dooRepository } from "@/repositories/doo.repository";
import { executeDoo } from "@/runtime/executor";
import { NotFoundError } from "@/lib/error";

export class ExecutionService {
  async executeDoo(dooId: number, method: string, path: string, rawRequest: Request) {
    const doo = await dooRepository.findById(dooId);
    if (!doo) throw new NotFoundError("Doo not found");

    const result = await executeDoo(doo.id, doo.code, method, path, rawRequest);


    // Persist the execution record
    await requestRepository.create({
      doo_id: doo.id,
      method,
      path,
      status: result.response.status,
      response: await result.response.clone().text(),
      logs: result.logs,
      doo_pix: result.pixels,
      duration: result.duration,
    });

    return result.response;
  }
}

export const executionService = new ExecutionService();
