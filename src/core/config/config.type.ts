import { AppConfig } from './app-config.type';
import { AppleConfig } from '../../modules/auth-apple/config/apple-config.type';
import { AuthConfig } from '../../modules/auth/config/auth-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { FileConfig } from '../../modules/files/config/file-config.type';
import { MailConfig } from '../mail/config/mail-config.type';
import { AmapConfig } from '../../modules/amap/config/amap-config.type';

export type AllConfigType = {
  app: AppConfig;
  apple: AppleConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  file: FileConfig;
  mail: MailConfig;
  amap: AmapConfig;
};
