import { Module } from "@nestjs/common";
import { ListRoutesService } from "./list-routes.service";
import { ListRoutesController } from "./list-routes.controller";
import { ListRoutesRepository } from "./list-routes.repository";

@Module({
  controllers: [ListRoutesController],
  providers: [ListRoutesService, ListRoutesRepository],
})
export class ListRoutesModule {}
