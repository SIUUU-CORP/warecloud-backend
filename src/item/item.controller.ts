import {
  Controller,
  HttpCode,
  HttpStatus,
  Query,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common'
import { ItemService } from './item.service'
import { IsPublic } from 'src/common/decorators/isPublic.decorator'
import {
  GetItemsQueryDTO,
  GetPublicItemsQueryDTO,
} from './DTO/getItemsQuery.DTO'
import { ResponseUtil } from 'src/common/utils/response.util'
import { allowedRole } from 'src/common/decorators/allowedRole.decorator'
import { Role } from '@prisma/client'
import { GetCurrentUserInterface } from 'src/common/interfaces/getCurrentUser.interface'
import { UpdateItemDTO } from './DTO/updateItem.DTO'
import { CreateItemDTO } from './DTO/createItem.DTO'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'

@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly responseUtil: ResponseUtil
  ) {}

  @IsPublic()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getPublicItems(@Query() query: GetPublicItemsQueryDTO) {
    const responseData = await this.itemService.getPublicItems(query)
    return this.responseUtil.response({}, responseData)
  }

  @allowedRole(Role.VENDOR)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getItems(
    @Query() query: GetItemsQueryDTO,
    @GetCurrentUser() user: GetCurrentUserInterface
  ) {
    const responseData = await this.itemService.getItems(query, user)

    return this.responseUtil.response({}, responseData)
  }

  @IsPublic()
  @Get(':itemId')
  @HttpCode(HttpStatus.OK)
  async getPublicDetailItem(@Param('itemId') itemId: string) {
    const responseData = await this.itemService.getPublicDetailItem(itemId)

    return this.responseUtil.response({}, responseData)
  }

  @allowedRole(Role.VENDOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createItemDTO: CreateItemDTO,
    @GetCurrentUser() user: GetCurrentUserInterface
  ) {
    const vendorId = user.id
    const responseData = await this.itemService.create(vendorId, createItemDTO)

    return this.responseUtil.response(
      {
        responseCode: HttpStatus.CREATED,
        responseMessage: 'Data created successfully',
      },
      { responseData }
    )
  }

  @allowedRole(Role.VENDOR)
  @Patch(':itemId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('itemId') itemId: string,
    @Body() updateItemDTO: UpdateItemDTO
  ) {
    const responseData = await this.itemService.update(itemId, updateItemDTO)

    return this.responseUtil.response(
      { responseMessage: 'Data updated successfully' },
      { responseData }
    )
  }

  @allowedRole(Role.VENDOR)
  @Delete(':itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('itemId') itemId: string) {
    await this.itemService.remove(itemId)

    return this.responseUtil.response({
      responseMessage: 'Item deleted successfully',
      responseCode: HttpStatus.NO_CONTENT,
    })
  }
}
