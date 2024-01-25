import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdvertisersService } from './advertisers.service';

@Controller('advertisers')
export class AdvertisersController {
  constructor(private readonly advertisersService: AdvertisersService) {}

  @Post()
  async addAdvertiser(
    @Body('advId') advertiserId: string,
    @Body('advName') advertiserName: string,
  ) {
    const generatedId = await this.advertisersService.insertAdvertiser(
      advertiserId,
      advertiserName,
    );
    return generatedId;
  }

  @Post('/ads_status')
  async setUpdateStatus(
    @Body('acoAdIds') acoAdIds: string,
    @Body('advId') advId: string,
    @Body('operationStatus') operationStatus: string,
  ) {
    console.log(acoAdIds, advId, operationStatus);
    const result = await this.advertisersService.setUpdateStatus(
      acoAdIds,
      advId,
      operationStatus,
    );
    return result;
  }

  @Post('/fatigue-list')
  async getFatigueList(
    @Body('advId') advId: string,
    @Body('adId') adId: string,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
  ) {
    const result = await this.advertisersService.getFatigueList(
      advId,
      adId,
      startDate,
      endDate,
    );
    return result;
  }

  @Get()
  async getAdvertisers() {
    const advertisers = await this.advertisersService.getAdvertisers();
    return advertisers.map((adv, index) => ({
      id: index + 1,
      advId: adv.advId,
      advName: adv.advName,
      index: adv.id,
    }));
  }

  @Get(':id')
  getAdvertiser(@Param('id') index: string) {
    return this.advertisersService.getSingleAdvertiser(index);
  }

  @Get(':id/ads-list')
  async getAdsList(@Param('id') advId: string) {
    const result = await this.advertisersService.getAdsList(advId);
    return result;
  }

  @Patch(':id')
  async updateAdvertiser(
    @Param('id') index: string,
    @Body('advId') advId: string,
    @Body('advName') advName: string,
  ) {
    await this.advertisersService.updateAdvertiser(index, advId, advName);
    return null;
  }

  @Delete(':id')
  async removeAdvertiser(@Param('id') index: string) {
    await this.advertisersService.deleteAdvertiser(index);
    return null;
  }
}
