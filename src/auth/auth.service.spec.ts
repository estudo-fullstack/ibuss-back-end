import { Test, TestingModule } from "@nestjs/testing";
import bcrypt from "bcrypt";

import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { JwtService } from "@nestjs/jwt";
import { InvalidCredentialsException, UserInactiveException } from "./errors/auth.error";
import { UserAlreadyExistsException } from "../users/errors/users.error";

jest.mock("bcrypt");

describe("AuthService tests", () => {
  let authService: AuthService;

  const authRepositoryMock = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: authRepositoryMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    authService = moduleFixture.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    // Evita que um mock configurado em um teste vaze para o próximo teste:
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("Should create a new user", async () => {
      const createUserDto = {
        name: "carol",
        cpf: "45317828791",
        email: "carol@prisma.com",
        phoneNumber: "11999999999",
        password: "123456",
      };

      (bcrypt.hash as jest.Mock).mockResolvedValueOnce("hash-mockado");

      authRepositoryMock.create.mockResolvedValueOnce({
        name: "carol",
        email: "carol@prisma.com",
        phoneNumber: "11999999999",
      });

      const result = await authService.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
      expect(authRepositoryMock.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: "hash-mockado",
      });

      expect(result.name).toEqual("carol");
      expect(result.email).toEqual("carol@prisma.com");
      expect(result.phoneNumber).toEqual("11999999999");
    });

    it("Should throw UserAlreadyExistsException when user already exists", async () => {
      const createUserDto = {
        name: "carol",
        cpf: "45317828791",
        email: "carol@prisma.com",
        phoneNumber: "11999999999",
        password: "123456",
      };

      (bcrypt.hash as jest.Mock).mockResolvedValueOnce("hash-mockado");

      authRepositoryMock.create.mockRejectedValueOnce(new UserAlreadyExistsException());

      const result = authService.create(createUserDto);

      await expect(result).rejects.toThrow(UserAlreadyExistsException);
    });
  });

  describe("login", () => {
    const makeLoginDto = (overrides = {}) => {
      return {
        email: "carol@prisma.com",
        password: "123456",
        ...overrides,
      };
    };

    const makeUserMock = (overrides = {}) => {
      return {
        id: "426e338d-2983-46cb-bca7-d0c78e49bc3c",
        name: "carol",
        cpf: "45317828791",
        email: "carol@prisma.com",
        phoneNumber: "11999999999",
        password: "passwordHash",
        status: "ACTIVE",
        createdAt: "2026-05-19T16:30:16.635Z",
        updatedAt: "2026-05-20T16:30:16.635Z",
        ...overrides,
      };
    };

    it("Should throw InvalidCredentialsException when non-existent credentials are provided", async () => {
      const inputData = makeLoginDto({ email: "notexiste@email.com" });

      authRepositoryMock.findByEmail.mockResolvedValueOnce(null);

      const result = authService.login(inputData);

      await expect(result).rejects.toThrow(InvalidCredentialsException);
      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });

    it("Should throw UserInactiveException when user exists but status is INACTIVE", async () => {
      const inputData = makeLoginDto();

      const expectedData = makeUserMock({ status: "INACTIVE", password: "senhaHash-correta" });

      authRepositoryMock.findByEmail.mockResolvedValueOnce(expectedData);

      const result = authService.login(inputData);

      await expect(result).rejects.toThrow(UserInactiveException);
      expect(authRepositoryMock.findByEmail).toHaveBeenCalledWith(inputData.email);
      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });

    it("Should throw InvalidCredentialsException when user provides wrong password", async () => {
      const inputData = makeLoginDto({ password: "senha-errada" });

      const expectedData = makeUserMock({ password: "senhaHash" });

      authRepositoryMock.findByEmail.mockResolvedValueOnce(expectedData);

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = authService.login(inputData);

      await expect(result).rejects.toThrow(InvalidCredentialsException);
      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });

    it("Should return token and user data when login is successful", async () => {
      const inputData = makeLoginDto({ password: "senha-certa" });

      const userId = "426e338d-2983-46cb-bca7-d0c78e49bc3c";

      const expectedData = makeUserMock();

      const payload = {
        sub: userId,
        email: "carol@prisma.com",
      };

      const expectedLoginData = {
        accessToken: "token-jwt-mockado",
        user: {
          id: userId,
          name: "carol",
          email: "carol@prisma.com",
        },
      };

      authRepositoryMock.findByEmail.mockResolvedValueOnce(expectedData);

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      jwtServiceMock.sign.mockReturnValueOnce("token-jwt-mockado");

      const result = await authService.login(inputData);

      expect(authRepositoryMock.findByEmail).toHaveBeenCalledWith(inputData.email);
      expect(jwtServiceMock.sign).toHaveBeenCalledWith(payload);

      expect(result.accessToken).toEqual(expectedLoginData.accessToken);

      expect(result.user.id).toEqual(expectedLoginData.user.id);
    });
  });
});
