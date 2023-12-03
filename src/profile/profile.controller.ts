import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Patch,
} from '@nestjs/common'
import { ProfileService } from './profile.service'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { ResponseUtil } from 'src/common/utils/response.util'
import { GetCurrentUserInterface } from 'src/common/interfaces/getCurrentUser.interface'
import { editProfileDTO } from './DTO/edit-profile.DTO'

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly responseUtil: ResponseUtil
  ) {}

  // Get profile
  @Get()
  @HttpCode(HttpStatus.OK)
  async getProfile(@GetCurrentUser() user: GetCurrentUserInterface) {
    const responseData = await this.profileService.getProfile(user)

    return this.responseUtil.response(
      {
        responseMessage: 'User data successfully fetched',
      },
      responseData
    )
  }

  // Edit profile
  @Patch()
  @HttpCode(HttpStatus.OK)
  async createOrder(
    @GetCurrentUser() user: GetCurrentUserInterface,
    @Body() body: editProfileDTO
  ) {
    const responseData = await this.profileService.editProfile(user, body)

    return this.responseUtil.response(
      {
        responseMessage: 'Profile successfully edited',
      },
      responseData
    )
  }
}
