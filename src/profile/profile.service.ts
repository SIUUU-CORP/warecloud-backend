import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { GetCurrentUserInterface } from 'src/common/interfaces/getCurrentUser.interface'
import { editProfileDTO } from './DTO/edit-profile.DTO'
import { PaginationUtil } from 'src/common/utils/pagination.util'

@Injectable()
export class ProfileService {
  constructor(
    private readonly paginationUtil: PaginationUtil,
    private readonly prisma: PrismaService
  ) {}

  async getProfile(userLoggedIn: GetCurrentUserInterface) {
    try {
      const userData = await this.prisma.user.findUnique({
        where: {
          id: userLoggedIn.id,
        },
      })

      const user = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        address: userData.address,
        phone_number: userData.phoneNumber,
      }
      return { user }
    } catch (error) {
      console.error('Error occurred while fetching profile:', error)
      throw new Error('Failed to fetch profile')
    }
  }

  async editProfile(
    userLoggedIn: GetCurrentUserInterface,
    body: editProfileDTO
  ) {
    try {
      const newUser = await this.prisma.user.update({
        where: {
          id: userLoggedIn.id,
        },
        data: {
          ...body,
        },
      })

      const user = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        address: newUser.address,
        phone_number: newUser.phoneNumber,
      }
      return { user }
    } catch (error) {
      console.error('Error occurred while editing profile:', error)
      throw new Error('Failed to edit profile')
    }
  }

  async getRequestItem(userLoggedIn: GetCurrentUserInterface, page: string) {
    try {
      // get all item belong to vendor
      const item = await this.prisma.item.findMany({
        where: {
          userId: userLoggedIn.id,
        },
      })
      const itemIds = item.map((item) => item.id)
      const ordersForItems = await this.prisma.order.findMany({
        where: {
          itemId: {
            in: itemIds,
          },
          user: {
            role: 'VENDOR',
          },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              password: false,
              address: false,
              createdAt: false,
              name: true,
              phoneNumber: false,
              role: true,
              orders: false,
              items: false,
            },
          },
          item: true,
        },
      })
      const data = this.paginationUtil.paginate(page, ordersForItems)
      return { orders: data.paginatedData, pagination: data.pagination }
    } catch (error) {
      console.error('Error occurred while fetching request order:', error)
      throw new Error('Failed to get request order')
    }
  }
  async manageOrderRequest(orderId: string, body: { isApproved: number }) {
    try {
      const { isApproved } = body
      const order = await this.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          orderStatus: isApproved === 1 ? 'ACCEPTED' : 'REJECTED',
        },
      })
      return { order }
    } catch (error) {
      console.error('Error occurred while changing order status', error)
      throw new Error('Failed to change order status')
    }
  }
}
