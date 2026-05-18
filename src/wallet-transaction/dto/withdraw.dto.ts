import { IsNumber, Min } from "class-validator";

export class WithdrawDto {
  @IsNumber()
  @Min(0.01, { message: "Withdrawal amount must be greater than zero" })
  amount!: number;
}
