import { Controller, Get, Post, Body } from '@nestjs/common';
import { PreferenceService } from './preference.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Preferences')
@Controller('preference')
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Get()
  findAll() {
    return this.preferenceService.findAll();
  }

  @ApiBearerAuth('access-token')
  @Post()
  create(@Body() createPreferenceDto: CreatePreferenceDto) {
    return this.preferenceService.create(createPreferenceDto);
  }
}
