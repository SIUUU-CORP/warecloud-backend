import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  GetItemsQueryDTO,
  GetPublicItemsQueryDTO,
} from './DTO/getItemsQuery.DTO'
import { Item, Prisma } from '@prisma/client'
import { CreateItemDTO } from './DTO/createItem.DTO'
import { UpdateItemDTO } from './DTO/updateItem.DTO'
import { PaginationUtil } from 'src/common/utils/pagination.util'
import { GetCurrentUserInterface } from 'src/common/interfaces/getCurrentUser.interface'

@Injectable()
export class ItemService {
  constructor(
    private readonly paginationUtil: PaginationUtil,
    private readonly prisma: PrismaService
  ) {}

  async getPublicItems({ search, page }: GetPublicItemsQueryDTO) {
    const items = await this.prisma.item.findMany({
      where: {
        NOT: {
          stock: 0,
        },
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { user: { name: { contains: search, mode: 'insensitive' } } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    const data = this.paginationUtil.paginate(page, items)
    return {
      items: data.paginatedData,
      pagination: data.pagination,
    }
  }

  async getPublicDetailItem(itemId: string) {
    const item = await this.prisma.item.findUnique({
      where: {
        id: itemId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    return { item: item }
  }

  async getItems({ page }: GetItemsQueryDTO, user: GetCurrentUserInterface) {
    const items = await this.prisma.item.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    const data = this.paginationUtil.paginate(page, items)
    return {
      items: data.paginatedData,
      pagination: data.pagination,
    }
  }

  async create(vendorId: string, data: CreateItemDTO): Promise<Item> {
    const item = await this.prisma.item.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive',
        },
      },
    })
    if (!!item) throw new ConflictException(`Item ${item.name} already exist`)

    try {
      return await this.prisma.item.create({
        data: { ...data, userId: vendorId },
      })
    } catch (error) {
      if (
        error.name === 'BadRequestException' ||
        error instanceof Prisma.PrismaClientValidationError
      ) {
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }

  async update(itemId: string, data: UpdateItemDTO): Promise<Item> {
    try {
      return await this.prisma.item.update({
        where: {
          id: itemId,
        },
        data,
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Item with id ${itemId} not found`)
      }
      if (
        error.name === 'BadRequestException' ||
        error instanceof Prisma.PrismaClientValidationError
      ) {
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }

  async remove(itemId: string): Promise<void> {
    try {
      await this.prisma.item.delete({
        where: {
          id: itemId,
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025')
          throw new NotFoundException(`Item with id ${itemId} not found`)
        if (error.code === 'P2003')
          throw new UnprocessableEntityException(
            `Delete Unsuccessful. ${itemId} have a reference in Request Order`
          )
      }
      throw error
    }
  }
}
