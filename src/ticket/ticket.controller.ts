import { Controller, Get, Post, Body, Param, UseGuards, Req } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";

import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import type { Request } from "express";

@UseGuards(JwtAuthGuard)
@Controller("ticket")
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // @Get()
  // findAll() {
  //   return this.ticketService.findAll();
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.ticketService.findOne(id);
  // }

  @Post("purchase")
  async purchase(@Req() req: Request, @Body() purchaseData: CreateTicketDto) {
    return this.ticketService.purchase(req.user!.id, purchaseData);
  }
}
