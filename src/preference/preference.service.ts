import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { Preference } from './entities/preference.entity';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectRepository(Preference)
    private preferenceRepository: Repository<Preference>,
  ) {}

  async create(createPreferenceDto: CreatePreferenceDto) {
    const { name } = createPreferenceDto;
    const user = this.preferenceRepository.create({
      name,
    });
    try {
      await this.preferenceRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Preference already exists');
      } else {
        console.log(error);
        throw new BadRequestException('Something went wrong');
      }
    }
  }

  findAll() {
    return `This action returns all preference`;
  }
}