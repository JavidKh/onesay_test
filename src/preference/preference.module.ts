import { Module } from '@nestjs/common';
import { PreferenceService } from './preference.service';
import { PreferenceController } from './preference.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preference } from './entities/preference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Preference])],
  controllers: [PreferenceController],
  providers: [PreferenceService],
  exports: [PreferenceService],
})
export class PreferenceModule {}
