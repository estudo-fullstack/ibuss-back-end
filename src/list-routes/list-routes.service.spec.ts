import { Test, TestingModule } from "@nestjs/testing";
import { ListRoutesQueryDto } from "./dto/list-routes-query.dto";
import { ListRoutesRepository } from "./list-routes.repository";
import { ListRoutesService } from "./list-routes.service";

describe("ListRoutesService", () => {
  let service: ListRoutesService;

  const mockRepository = {
    findCompaniesByRoute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListRoutesService, { provide: ListRoutesRepository, useValue: mockRepository }],
    }).compile();

    service = module.get<ListRoutesService>(ListRoutesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should delegate the query to the repository", async () => {
    const query: ListRoutesQueryDto = {
      origin: "São Paulo",
      destination: "Rio de Janeiro",
      priceOrder: "desc",
    };
    mockRepository.findCompaniesByRoute.mockResolvedValueOnce([]);

    await service.findCompaniesByRoute(query);

    expect(mockRepository.findCompaniesByRoute).toHaveBeenCalledWith(query);
    expect(mockRepository.findCompaniesByRoute).toHaveBeenCalledTimes(1);
  });

  it("should forward query without priceOrder when not provided", async () => {
    const query: ListRoutesQueryDto = {
      origin: "Belo Horizonte",
      destination: "Vitória",
    };
    mockRepository.findCompaniesByRoute.mockResolvedValueOnce([]);

    await service.findCompaniesByRoute(query);

    expect(mockRepository.findCompaniesByRoute).toHaveBeenCalledWith(query);
  });

  it("should return exactly what the repository returns", async () => {
    const query: ListRoutesQueryDto = {
      origin: "Curitiba",
      destination: "Florianópolis",
    };
    const routes = [
      {
        id: "route-id-1",
        routeNumber: "2001",
        origin: "Curitiba",
        destination: "Florianópolis",
        price: "89.90",
        departureLocation: "Rodoviária de Curitiba",
        arrivalLocation: "Terminal Central",
        company: { name: "Expresso do Sul" },
      },
    ];
    mockRepository.findCompaniesByRoute.mockResolvedValueOnce(routes);

    const result = await service.findCompaniesByRoute(query);

    expect(result).toEqual(routes);
  });

  it("should propagate errors thrown by the repository", async () => {
    const query: ListRoutesQueryDto = {
      origin: "Salvador",
      destination: "Recife",
    };
    mockRepository.findCompaniesByRoute.mockRejectedValueOnce(new Error("database error"));

    await expect(service.findCompaniesByRoute(query)).rejects.toThrow("database error");
  });
});
