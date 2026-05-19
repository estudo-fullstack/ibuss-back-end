import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  InternalServerErrorException,
  UseGuards
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

function isPrismaError(error: unknown): error is { code?: string } {
  return typeof error === "object" && error !== null && "code" in error;
}

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      return this.usersService.findOne(id);
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundException("User not found");
      } else {
        throw new InternalServerErrorException("An error occurred while updating the user");
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id", new ParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("password/:id")
  updatePassword(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto
  ) {
    return this.usersService.updatePassword(id, updateUserPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("deactivate/:id")
  deactivateUser(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      return this.usersService.deactivateUser(id);
    } catch (error) {
     if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundException("User not found");
      } else throw new InternalServerErrorException("An error occurred while updating the user");
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch("suspend/:id")
  suspendUser(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      return this.usersService.suspendUser(id);
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new NotFoundException("User not found");
      } else {
        throw new InternalServerErrorException("An error occurred while updating the user");
      }
    }
  }
}
