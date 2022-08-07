import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreferenceService } from './preference/preference.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private preferenceService: PreferenceService) {}

  getHello(): string {
    return 'Hello World!';
  }
  onApplicationBootstrap(): any {
    this.preferenceService.seed();
  }
}
