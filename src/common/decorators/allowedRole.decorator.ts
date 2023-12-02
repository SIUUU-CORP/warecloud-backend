import { SetMetadata } from '@nestjs/common'
import { Role } from '@prisma/client'

export const allowedRole = (role: Role) => SetMetadata('allowedRole', role)
