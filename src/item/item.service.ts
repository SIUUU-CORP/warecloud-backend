import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { GetItemsQueryDTO } from './DTO/getItemsQuery.DTO'
import { PaginationInterface } from 'src/common/interfaces/pagination.interface'

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async getItems({ itemName, vendorName, page }: GetItemsQueryDTO) {
    const TAKES_PER_PAGE = 24

    const items = await this.prisma.item.findMany({
      where: {
        NOT: {
          stock: 0
        },
        ...(itemName ? { name: itemName } : {}),
        ...(vendorName
          ? {
              user: {
                name: vendorName,
              },
            }
          : {}),
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
    if (currentPage > maxPage) {
      currentPage = maxPage
    }

    const numPrevItems = (currentPage - 1) * TAKES_PER_PAGE
    const slicedItems = items.slice(numPrevItems, numPrevItems + TAKES_PER_PAGE)
    const hasPrev = currentPage === 1 ? false : true
    const hasNext = currentPage === maxPage ? false : true

    const pagination: PaginationInterface = {
      records: items.length,
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
}
