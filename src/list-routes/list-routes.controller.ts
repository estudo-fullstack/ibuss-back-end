import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ListRoutesService } from "./list-routes.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ListRoutesQueryDto } from "./dto/list-routes-query.dto";

@UseGuards(JwtAuthGuard)
@Controller("list-routes")
export class ListRoutesController {
  constructor(private readonly listRoutesService: ListRoutesService) {}

  @Get()
  findCompaniesByRoute(@Query() query: ListRoutesQueryDto) {
    return this.listRoutesService.findCompaniesByRoute(query);
  }
}
