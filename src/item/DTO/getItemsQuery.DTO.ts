import { IsOptional, IsString } from "class-validator"


export class GetItemsQueryDTO {
    @IsOptional()
    @IsString()
    itemName: string

    @IsOptional()
    @IsString()
    vendorName: string

    @IsOptional()
    page: number
}