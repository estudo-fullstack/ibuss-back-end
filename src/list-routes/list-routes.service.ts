import { Injectable } from "@nestjs/common";
import { ListRoutesRepository } from "./list-routes.repository";
import { ListRoutesQueryDto } from "./dto/list-routes-query.dto";

@Injectable()
export class ListRoutesService {
  constructor(private listRoutesRepository: ListRoutesRepository) {}

  async findCompaniesByRoute(query: ListRoutesQueryDto) {
    return await this.listRoutesRepository.findCompaniesByRoute(query);
  }
}
