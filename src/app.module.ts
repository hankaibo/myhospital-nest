import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { FilesModule } from './modules/files/files.module';
import { AuthModule } from './modules/auth/auth.module';
import databaseConfig from './core/database/config/database.config';
import authConfig from './modules/auth/config/auth.config';
import appConfig from './core/config/app.config';
import mailConfig from './core/mail/config/mail.config';
import fileConfig from './modules/files/config/file.config';
import appleConfig from './modules/auth-apple/config/apple.config';
import amapConfig from './modules/amap/config/amap.config';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthAppleModule } from './modules/auth-apple/auth-apple.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { TypeOrmConfigService } from './core/database/typeorm-config.service';
import { MailModule } from './core/mail/mail.module';
import { HomeModule } from './modules/home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from './core/config/config.type';
import { SessionModule } from './shared/session/session.module';
import { MailerModule } from './core/mailer/mailer.module';
import { HospitalsModule } from './modules/hospitals/hospitals.module';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        appleConfig,
        amapConfig,
      ],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: {
          path: path.join(__dirname, '/core/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    AuthAppleModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
    HospitalsModule,
  ],
})
export class AppModule {}
