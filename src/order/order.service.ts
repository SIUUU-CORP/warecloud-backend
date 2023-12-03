import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateOrderDTO } from './DTO/createOrder.DTO'
import { GetCurrentUserInterface } from 'src/common/interfaces/getCurrentUser.interface'

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(
    user: GetCurrentUserInterface,
    { itemId, amount, vendorId }: CreateOrderDTO
  ) {
    const SHIPPING_RATE = 10000

    if (amount < 1) {
      throw new BadRequestException('Amount must be greater than or equal to 1')
    }

    const item = await this.prisma.item.findUnique({
      where: {
        id: itemId,
        userId: vendorId,
      },
    })

    if (!item) {
      throw new NotFoundException('Item not found')
    }

    const { id, role } = user
    const { price, weight, stock, userId } = item
    if (id === userId) {
      throw new ForbiddenException('Cannot order your own item')
    }

    if (stock === 0) {
      throw new ForbiddenException('Item out of stock')
    }

    let cost = price * amount
    if (role === 'CUSTOMER') {
      const shippingCost = amount * weight * SHIPPING_RATE
      cost += shippingCost
    }

    const order = await this.prisma.order.create({
      data: {
        amount: amount,
        cost: cost,
        orderStatus: 'PENDING',
        itemId: itemId,
        userId: id,
      },
    })

    return { order: order }
  }
}
