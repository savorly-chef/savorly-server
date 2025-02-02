import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserData } from './auth.service';
import { AppleAuthCredential } from './interfaces/apple-auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('username') username: string,
  ) {
    return await this.authService.register(email, password, username);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: { user: Omit<UserData, 'password'> }) {
    return await this.authService.login(req.user);
  }

  @Post('refresh')
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @Post('apple')
  async appleSignIn(@Body() credential: AppleAuthCredential) {
    return await this.authService.handleAppleSignIn(credential);
  }
}
