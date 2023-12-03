import { IsOptional, IsString } from 'class-validator'

export class GetItemsQueryDTO {
  @IsOptional()
  @IsString()
  search: string

  @IsOptional()
  @IsString()
  page: string
}
