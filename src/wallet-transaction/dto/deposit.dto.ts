import { IsNumber, Min } from "class-validator";

export class DepositDto {
  @IsNumber()
  @Min(0.01, { message: "Deposit amount must be greater than zero" })
  amount!: number;
}
