import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { OrderService } from './order.service'
import { CreateOrderDTO } from './DTO/createOrder.DTO'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { ResponseUtil } from 'src/common/utils/response.util'
import { GetCurrentUserInterface } from 'src/common/interfaces/getCurrentUser.interface'

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly responseUtil: ResponseUtil
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @GetCurrentUser() user: GetCurrentUserInterface,
    @Body() body: CreateOrderDTO
  ) {
    const responseData = await this.orderService.createOrder(user, body)

    return this.responseUtil.response(
      {
        responseCode: HttpStatus.CREATED,
        responseMessage: 'Order successfully created',
      },
      responseData
    )
  }
}
