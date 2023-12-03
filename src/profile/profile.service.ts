import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { GetCurrentUserInterface } from 'src/common/interfaces/getCurrentUser.interface'
import { editProfileDTO } from './DTO/edit-profile.DTO'
import { validate } from 'class-validator'

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userLoggedIn: GetCurrentUserInterface) {
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
}
