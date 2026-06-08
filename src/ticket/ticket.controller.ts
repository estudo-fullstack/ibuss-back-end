import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Param,
  ParseUUIDPipe,
  ParseEnumPipe,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { TicketService } from "./ticket.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { TicketStatusType } from "src/generated/prisma/enums";
import type { Request } from "express";

@UseGuards(JwtAuthGuard)
@Controller("ticket")
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  findAll(
    @Req() req: Request,
    @Query("status", new ParseEnumPipe(TicketStatusType)) status: TicketStatusType
  ) {
    return this.ticketService.findByUser(req.user!.id, status);
  }

  @Get(":id")
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.ticketService.findOne(id);
  }

  @Post("purchase")
  async purchase(@Req() req: Request, @Body() purchaseData: CreateTicketDto) {
    return this.ticketService.purchase(req.user!.id, purchaseData);
  }
}
