import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { AmapConfig } from './amap-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  AMAP_KEY: string;

  @IsString()
  AMAP_URL: string;
}

export default registerAs<AmapConfig>('amap', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    key: process.env.AMAP_KEY,
    url: process.env.AMAP_URL,
  };
});
