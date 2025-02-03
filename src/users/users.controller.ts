import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

export class UpdateUserDto {
  premium?: boolean;
  language?: string;
  username?: string;
  bio?: string;
  profileImage?: string;
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // PUT: /users/me
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateUser(
    @CurrentUser() user: { sub: number },
    @Body() updateData: UpdateUserDto,
  ) {
    return this.usersService.updateUser(user.sub, updateData);
  }
}
