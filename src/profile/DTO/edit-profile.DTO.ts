import { IsNotEmpty, IsString } from 'class-validator'

export class editProfileDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string

  @IsString()
  @IsNotEmpty()
  readonly address: string
}
