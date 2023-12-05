import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { GetItemsQueryDTO } from './DTO/getItemsQuery.DTO'
import { PaginationInterface } from 'src/common/interfaces/pagination.interface'
import { Item, Prisma } from '@prisma/client'
import { CreateItemDTO } from './DTO/createItem.DTO'
import { UpdateItemDTO } from './DTO/updateItem.DTO'

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async getItems({ search, page }: GetItemsQueryDTO) {
    const TAKES_PER_PAGE = 24

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

    const pageInt = parseInt(page)
    let currentPage = pageInt ? pageInt : 1
    const maxPage = Math.ceil(items.length / TAKES_PER_PAGE)
    if (currentPage > maxPage && maxPage !== 0) {
      currentPage = maxPage
    }

    const numPrevItems = (currentPage - 1) * TAKES_PER_PAGE
    const slicedItems = items.slice(numPrevItems, numPrevItems + TAKES_PER_PAGE)
    const hasPrev = currentPage === 1 ? false : true
    const hasNext = (currentPage === maxPage || maxPage === 0) ? false : true

    const pagination: PaginationInterface = {
      pages: maxPage,
      hasPrev: hasPrev,
      hasNext: hasNext,
    }

    return {
      items: slicedItems,
      pagination: pagination,
    }
  }

  async getDetailItem(itemId: string) {
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
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Item with id ${itemId} not found`)
      }
      throw error
    }
  }
}
