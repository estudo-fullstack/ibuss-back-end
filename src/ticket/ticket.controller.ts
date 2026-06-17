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
  Patch,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { TicketValidationService } from "./ticketValidation.service";
import { TicketService } from "./ticket.service";
import { PurchaseTicketDto } from "./dto/create-ticket.dto";
import { TicketStatusType } from "src/generated/prisma/enums";
import type { Request } from "express";
import { TicketDataDto } from "./dto/ticket-data.dto";

@UseGuards(JwtAuthGuard)
@Controller("ticket")
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly ticketValidationService: TicketValidationService
  ) {}

  @Get()
  findAll(
    @Req() req: Request,
    @Query("status", new ParseEnumPipe(TicketStatusType)) status: TicketStatusType
  ) {
    return this.ticketService.findManyByUserAndStatus(req.user!.id, status);
  }

  @Get(":id")
  findOne(@Req() req: Request, @Param("id", new ParseUUIDPipe()) id: string) {
    return this.ticketService.findOne(req.user!.id, id);
  }

  @Post("purchase")
  purchase(@Req() req: Request, @Body() purchaseData: PurchaseTicketDto) {
    return this.ticketService.purchase(req.user!.id, purchaseData);
  }

  @Patch(":id/cancel")
  cancel(@Req() req: Request, @Param("id", new ParseUUIDPipe()) id: string) {
    return this.ticketService.markAsCanceled(req.user!.id, id);
  }

  @Post("validate")
  validade(@Body() ticketData: TicketDataDto) {
    return this.ticketValidationService.validateTicket(ticketData);
  }
}
