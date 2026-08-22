import { Test, TestingModule } from "@nestjs/testing";
import { ListRoutesController } from "./list-routes.controller";
import { ListRoutesService } from "./list-routes.service";

describe("ListRoutesController", () => {
  let controller: ListRoutesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListRoutesController],
      providers: [ListRoutesService],
    }).compile();

    controller = module.get<ListRoutesController>(ListRoutesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
