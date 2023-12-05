import { IsOptional, IsString } from 'class-validator'

export class GetPublicItemsQueryDTO {
  @IsOptional()
  @IsString()
  itemName: string

  @IsOptional()
  @IsString()
  vendorName: string

  @IsOptional()
  @IsString()
  page: string
}

export class GetItemsQueryDTO {
  @IsOptional()
  @IsString()
  page: string
}
