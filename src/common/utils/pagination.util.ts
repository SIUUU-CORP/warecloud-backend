import { Injectable } from '@nestjs/common'
import { PaginationInterface } from '../interfaces/pagination.interface'

@Injectable()
export class PaginationUtil {
  paginate<T>(page: string, data: T[]) {
    const TAKES_PER_PAGE = 24

    const pageInt = parseInt(page)
    let currentPage = pageInt ? pageInt : 1
    const maxPage = Math.ceil(data.length / TAKES_PER_PAGE)
    if (currentPage > maxPage) {
      currentPage = maxPage
    }

    const numPrevData = (currentPage - 1) * TAKES_PER_PAGE
    const paginatedData = data.slice(numPrevData, numPrevData + TAKES_PER_PAGE)

    const pagination: PaginationInterface = {
      records: data.length,
      hasPrev: currentPage !== 1,
      hasNext: currentPage !== maxPage,
    }

    return { paginatedData, pagination }
  }
}
