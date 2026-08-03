import { IsString, IsUUID } from "class-validator";

export class TicketDataDto {
  @IsUUID()
  ticketId!: string;

  @IsUUID()
  routeId!: string;
}
