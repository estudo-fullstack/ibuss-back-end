import { IsString, IsNumber, Min, IsUUID } from "class-validator";

export class PurchaseTicketDto {
  @IsString()
  @IsUUID()
  routeId!: string;
}
