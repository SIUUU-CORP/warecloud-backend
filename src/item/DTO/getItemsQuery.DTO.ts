import { IsOptional, IsString } from 'class-validator'

export class GetPublicItemsQueryDTO {
  @IsOptional()
  @IsString()
  search: string

  @IsOptional()
  @IsString()
  page: string
}

export class GetItemsQueryDTO {
  @IsOptional()
  @IsString()
  page: string
}
