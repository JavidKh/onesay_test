import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { AttachPreferenceDto } from './dto/attach-preference.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard())
  @Get()
  findAll(@GetUser() user: User) {
    return this.userService.getUser(user);
  }

  @UseGuards(AuthGuard())
  @Post('/preferences')
  attachPreference(
    @Body() attachPreferenceDto: AttachPreferenceDto,
    @GetUser() user: User,
  ) {
    return this.userService.attachPreference(attachPreferenceDto, user);
  }
}
