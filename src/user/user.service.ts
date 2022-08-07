import { Injectable } from '@nestjs/common';
import { PreferenceService } from 'src/preference/preference.service';
import { AttachPreferenceDto } from './dto/attach-preference.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly preferenceService: PreferenceService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUser(user: User) {
    const data = await this.usersRepository.findOne({
      relations: {
        preferences: true,
      },
      select: ['full_name', 'id', 'created', 'dob', 'email', 'preferences'],

      where: { id: user.id },
    });
    return data;
  }

  async attachPreference(attachPreferenceDto: AttachPreferenceDto, user: User) {
    const { preferences } = attachPreferenceDto;
    const preferencesList = await this.preferenceService.findByIds(preferences);

    user.preferences = preferencesList;
    await this.usersRepository.save(user);

    return attachPreferenceDto;
  }
}
