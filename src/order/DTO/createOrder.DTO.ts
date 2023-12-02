import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateOrderDTO {
  @IsNotEmpty()
  @IsString()
  itemId: string

  @IsNotEmpty()
  @IsNumber()
  amount: number

  @IsNotEmpty()
  @IsString()
  vendorId: string
}
