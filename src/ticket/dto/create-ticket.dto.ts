import { IsString, IsNumber, Min } from "class-validator";

export class PurchaseTicketDto {
  @IsString()
  routeId!: string;

  @IsNumber()
  @Min(0.01)
  purchasePrice!: number;
}
