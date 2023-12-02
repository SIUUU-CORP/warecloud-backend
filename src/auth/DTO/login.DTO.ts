import { IsNotEmpty, IsString } from 'class-validator'

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  readonly email: string

  @IsString()
  @IsNotEmpty()
  readonly password: string
}
