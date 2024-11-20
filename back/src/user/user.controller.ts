import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUserId } from 'src/common/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getMe')
  async getMe(@CurrentUserId() userId: number) {
    const user = await this.userService.findOneById(userId);
    const { password: _password, token: _token, ...result } = user;
    return result;
  }
}
