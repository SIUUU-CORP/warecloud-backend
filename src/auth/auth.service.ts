import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { LoginDTO } from './DTO/login.DTO'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { RegisterDTO } from './DTO/register.DTO'
import { Role } from '@prisma/client'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    })
  }

  async hashPassword(plainText: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(plainText, salt)
    return hashPassword
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  async login(body: LoginDTO) {
    const user = await this.getUser(body.email)

    if (!user) {
      throw new NotFoundException(`User with email ${body.email} is not found`)
    }

    const isPasswordValid = await this.comparePassword(
      body.password,
      user.password
    )

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password')
    }

    const expiresIn = process.env.JWT_EXPIRY as string
    const token = sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn }
    )

    return { user, token }
  }

  async register(body: RegisterDTO) {
    const { email, name, password, role, phoneNumber, address } = body

    const hashedPassword = await this.hashPassword(password)

    const user = await this.getUser(email)

    if (!!user) {
      throw new BadRequestException('Email is used')
    }

    const capitalizeRole = role.toUpperCase()
    if (capitalizeRole !== 'CUSTOMER' && capitalizeRole !== 'VENDOR') {
      throw new BadRequestException('Invalid role')
    }

    await this.prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
        role: capitalizeRole === 'CUSTOMER' ? Role.CUSTOMER : Role.VENDOR,
        phoneNumber: phoneNumber,
        address: address,
      },
    })
  }
}
