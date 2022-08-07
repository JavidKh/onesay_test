import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResetToken } from './auth/entities/reset-token';
import { PreferenceModule } from './preference/preference.module';
import { Preference } from './preference/entities/preference.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.production', '.env.development'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: 'root',
        password: 'secret',
        database: 'onesay',
        entities: [User, ResetToken, Preference],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
          defaults: {
            from: `"No Reply" <${configService.get<string>('MAIL_FROM')}>`,
          },
        },
      }),
      inject: [ConfigService],
    }),

    PreferenceModule,

    UserModule,
  ],
  providers: [AppService],
})
export class AppModule {}
