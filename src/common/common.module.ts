import { Global, Module } from '@nestjs/common'
import { ResponseUtil } from './utils/response.util'
import { PaginationUtil } from './utils/pagination.util'

@Global()
@Module({
  providers: [ResponseUtil, PaginationUtil],
  exports: [ResponseUtil, PaginationUtil],
})
export class CommonModule {}
