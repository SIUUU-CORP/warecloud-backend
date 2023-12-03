import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ResponseUtil } from 'src/common/utils/response.util'
import { LoginDTO } from './DTO/login.DTO'
import { RegisterDTO } from './DTO/register.DTO'
import { IsPublic } from 'src/common/decorators/isPublic.decorator'

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
      { responseMessage: 'Successfully logged in', responseCode: 200 },
      { ...response }
    )
  }

  @IsPublic()
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDTO) {
    await this.authService.register(registerDto)
    return this.responseUtil.response({
      responseCode: 201,
      responseMessage: `Email ${registerDto.email} is successfully registered`,
    })
  }
}
