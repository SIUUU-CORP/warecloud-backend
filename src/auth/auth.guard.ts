import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const authorization = request.headers?.authorization

    if (this.getPublicStatus(context)) return true

    if (!authorization) {
      return false
    }

    const token = authorization.split(' ')[1]
    const { role, email, id } = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    })

    const user = { email, id, role }
    request.user = user

    const allowedRole = this.getRole(context)
    if (!!allowedRole && allowedRole !== role) {
      return false
    }

    return true
  }

  private getPublicStatus(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ])
  }

  private getRole(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>('allowedRole', [
      context.getHandler(),
      context.getClass(),
    ])
  }
}
