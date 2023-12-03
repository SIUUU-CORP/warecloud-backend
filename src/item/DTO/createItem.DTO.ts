import { IsInt, IsNotEmpty, IsString } from 'class-validator'

export class CreateItemDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  description?: string

  @IsInt()
  @IsNotEmpty()
  weight: number

  @IsInt()
  @IsNotEmpty()
  stock: number

  @IsInt()
  @IsNotEmpty()
  price: number
}
