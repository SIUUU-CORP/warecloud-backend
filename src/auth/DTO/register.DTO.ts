import { IsNotEmpty, IsString } from 'class-validator'

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  readonly email: string

  @IsString()
  @IsNotEmpty()
  readonly name: string

  @IsString()
  @IsNotEmpty()
  readonly password: string

  @IsString()
  @IsNotEmpty()
  readonly role: string

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string

  @IsString()
  @IsNotEmpty()
  readonly address: string
}
