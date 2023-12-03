import { PartialType } from '@nestjs/mapped-types'
import { CreateItemDTO } from './createItem.DTO'

export class UpdateItemDTO extends PartialType(CreateItemDTO) {}
