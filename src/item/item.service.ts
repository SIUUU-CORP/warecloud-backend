import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { GetItemsQueryDTO } from './DTO/getItemsQuery.DTO'

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async getItems({ itemName, vendorName, page }: GetItemsQueryDTO) {
    const TAKES_PER_PAGE = 24

    const items = await this.prisma.item.findMany({
      where: {
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
            id: true,
            name: true,
          },
        },
      },
    })

    let currentPage = page ? page : 1
    const maxPage = Math.ceil(items.length / TAKES_PER_PAGE)
    if (currentPage > maxPage) {
      currentPage = maxPage
    }

    const numPrevItems = (currentPage - 1) * TAKES_PER_PAGE
    const slicedItems = items.slice(numPrevItems, numPrevItems + TAKES_PER_PAGE)
    const hasPrev = currentPage === 1 ? false : true
    const hasNext = currentPage === maxPage ? false : true

    return {
      items: slicedItems,
      pagination: {
        hasPrev: hasPrev,
        hasNext: hasNext,
      },
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
            id: true,
            name: true,
          },
        },
      },
    })

    return { item: item }
  }
}
