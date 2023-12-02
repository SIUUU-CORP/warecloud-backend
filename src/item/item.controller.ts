import {
  Controller,
  HttpCode,
  HttpStatus,
  Query,
  Get,
  Param,
} from '@nestjs/common'
import { ItemService } from './item.service'
import { IsPublic } from 'src/common/decorators/isPublic.decorator'
import { GetItemsQueryDTO } from './DTO/getItemsQuery.DTO'
import { ResponseUtil } from 'src/common/utils/response.util'

@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly responseUtil: ResponseUtil
  ) {}

  @IsPublic()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getItems(@Query() query: GetItemsQueryDTO) {
    const responseData = await this.itemService.getItems(query)

    return this.responseUtil.response({}, responseData)
  }

  @IsPublic()
  @Get(':itemId')
  @HttpCode(HttpStatus.OK)
  async getDetailItem(@Param('itemId') itemId: string) {
    const responseData = await this.itemService.getDetailItem(itemId)

    return this.responseUtil.response({}, responseData)
  }
}
