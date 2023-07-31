import { Controller, Get, Redirect } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiTags } from '@nestjs/swagger';

import { HomeService } from './home.service';
import { BingWallpaperType } from '../home/types/bing-wallpaper.type';

@ApiTags('Home')
@Controller()
export class HomeController {
  constructor(
    private service: HomeService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  appInfo() {
    return this.service.appInfo();
  }
  @Get('background')
  @Redirect()
  public async getBingBackground(): Promise<object> {
    const base = 'https://cn.bing.com';
    const path = `${base}/HPImageArchive.aspx?format=js&idx=0&n=1`;
    const res = await this.httpService.axiosRef.get<BingWallpaperType>(path, {
      responseType: 'json',
    });
    const url = `${base}${res.data.images[0].url}`;
    return { url };
  }
}
