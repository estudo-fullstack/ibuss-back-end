import { Test, TestingModule } from "@nestjs/testing";
import bcrypt from "bcrypt";

import { UsersService } from "./users.service";
import { UsersRepository } from "./users.repository";

import { UserAlreadyExistsException, UserNotFoundException } from "./errors/users.error";

jest.mock("bcrypt");

describe("UsersService tests", () => {
  let usersService: UsersService;

  const usersRepositoryMock = {
    findById: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deactivateById: jest.fn(),
  };

  (bcrypt.hash as jest.Mock).mockResolvedValue("hash-mockado");

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: usersRepositoryMock,
        },
      ],
    }).compile();

    // Obtém a instância do UsersService do módulo de testes com o UsersRepository mockado
    usersService = moduleFixture.get<UsersService>(UsersService);
  });

  it("Should initialize the module", () => {
    expect(usersService).toBeDefined();
  });

  it("findOne - Should return a single user", async () => {
    const userExample = {
      id: "426e338d-2983-46cb-bca7-d0c78e49bc3c",
      name: "carol",
      cpf: "45317828791",
      email: "carol@prisma.com",
      phoneNumber: "11999999999",
      status: "ACTIVE",
    };

    usersRepositoryMock.findById.mockResolvedValueOnce({
      name: "carol",
      email: "carol@prisma.com",
      phoneNumber: "11999999999",
    });

    const result = await usersService.findOne(userExample.id);

    expect(result.email).toEqual(userExample.email);
  });

  it("findOne - Should throw UserNotFoundException when user does not exist", async () => {
    usersRepositoryMock.findById.mockRejectedValueOnce(new UserNotFoundException());

    const result = usersService.findOne("id-inexistente");

    await expect(result).rejects.toThrow(UserNotFoundException);
  });

  it("create - Should create a new user", async () => {
    const createUserDto = {
      name: "carol",
      cpf: "45317828791",
      email: "carol@prisma.com",
      phoneNumber: "11999999999",
      password: "123456",
    };

    usersRepositoryMock.create.mockResolvedValueOnce({
      name: "carol",
      email: "carol@prisma.com",
      phoneNumber: "11999999999",
    });

    const result = await usersService.create(createUserDto);

    expect(usersRepositoryMock.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: "hash-mockado",
    });

    expect(result.name).toEqual("carol");
    expect(result.email).toEqual("carol@prisma.com");
    expect(result.phoneNumber).toEqual("11999999999");
  });

  it("create - Should throw UserAlreadyExistsException when user already exists", async () => {
    const createUserDto = {
      name: "carol",
      cpf: "45317828791",
      email: "carol@prisma.com",
      phoneNumber: "11999999999",
      password: "123456",
    };

    usersRepositoryMock.create.mockRejectedValueOnce(new UserAlreadyExistsException());

    const result = usersService.create(createUserDto);

    await expect(result).rejects.toThrow(UserAlreadyExistsException);
  });

  it("update - Should update an existing user", async () => {
    const userId = "userId";

    const updateUserDto = {
      name: "carol update",
      email: "carol.update@prisma.com",
      phoneNumber: "11999999999",
    };

    usersRepositoryMock.updateById.mockResolvedValueOnce({
      name: "carol update",
      email: "carol.update@prisma.com",
      phoneNumber: "11999999999",
    });

    const result = await usersService.update(userId, updateUserDto);

    expect(usersRepositoryMock.updateById).toHaveBeenCalledWith(userId, updateUserDto);

    expect(result.name).toEqual("carol update");
    expect(result.email).toEqual("carol.update@prisma.com");
    expect(result.phoneNumber).toEqual("11999999999");
  });

  it("update - Should throw UserNotFoundException when updating a non-existent user", async () => {
    const userId = "usernotfound";
    const updateUserDto = {
      name: "userNotFound",
      email: "usernotfound@prisma.com",
      phoneNumber: "11999999999",
    };

    usersRepositoryMock.updateById.mockRejectedValueOnce(new UserNotFoundException());

    const result = usersService.update(userId, updateUserDto);

    await expect(result).rejects.toThrow(UserNotFoundException);
    // Nota: Este teste valida a propagação de erros do repositório para o service, não o comportamento do repositório. A introdução de um try-catch no service quebre esse teste.
  });

  it("deactivateUser - Should change user status to INACTIVE for existing user", async () => {
    const userId = "userId";
    const expectedData = {
      name: "carol inactive",
      email: "carol.inactive@prisma.com",
      phoneNumber: "11999999999",
    };
    usersRepositoryMock.deactivateById.mockResolvedValueOnce(expectedData);

    const result = await usersService.deactivateUser(userId);

    expect(usersRepositoryMock.deactivateById).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.deactivateById).toHaveBeenCalledWith(userId);
    expect(result.name).toEqual(expectedData.name);
    expect(result.email).toEqual(expectedData.email);
    expect(result.phoneNumber).toEqual(expectedData.phoneNumber);
  });
});
