import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ResponseUtil } from 'src/common/utils/response.util'
import { LoginDTO } from './DTO/login.DTO'
import { RegisterDTO } from './DTO/register.DTO'
import { IsPublic } from 'src/common/decorators/isPublic.decorator'
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator'
import { User } from '@prisma/client'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private responseUtil: ResponseUtil
  ) {}

  @IsPublic()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDTO) {
    const response = await this.authService.login(body)
    return this.responseUtil.response(
      {
        responseMessage: 'Successfully logged in',
        responseCode: HttpStatus.OK,
      },
      { ...response }
    )
  }

  @IsPublic()
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDTO) {
    await this.authService.register(registerDto)
    return this.responseUtil.response({
      responseCode: HttpStatus.CREATED,
      responseMessage: `Email ${registerDto.email} is successfully registered`,
    })
  }

  @Get('/user')
  @HttpCode(HttpStatus.OK)
  async getUser(@GetCurrentUser() user: User) {
    const { email } = user
    const data = await this.authService.getUser(email)
    return this.responseUtil.response(
      {
        responseCode: HttpStatus.OK,
        responseMessage: `Data retrieved successfully`,
      },
      { user: data }
    )
  }
}
