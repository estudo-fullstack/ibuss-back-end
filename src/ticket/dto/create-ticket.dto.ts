import { IsString, IsNumber, Min } from "class-validator";

export class CreateTicketDto {
  @IsString()
  routeId!: string;

  @IsNumber()
  @Min(0.01)
  purchasePrice!: number;
}
