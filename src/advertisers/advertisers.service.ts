import { Injectable, NotFoundException } from '@nestjs/common';
import { Advertiser } from './advertiser.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';

@Injectable()
export class AdvertisersService {
  private advertisers: Advertiser[] = [];

  constructor(
    @InjectModel('Advertiser')
    private readonly advertiserModel: Model<Advertiser>,
  ) {}

  async insertAdvertiser(advId: string, advName: string) {
    const advertiser = await this.advertiserModel.findOne({ advId: advId });
    if (advertiser) {
      return {
        msg: 'Already exist the same advertiser Id.',
        success: false,
      };
    } else {
      const newAdvertiser = new this.advertiserModel({
        advId,
        advName,
      });
      await newAdvertiser.save();
      return {
        msg: 'Created new advertiser successfully.',
        success: true,
      };
    }
  }

  async getAdvertisers() {
    const advertisers = await this.advertiserModel.find().exec();
    return advertisers as Advertiser[];
  }

  async getSingleAdvertiser(advertiserId: string) {
    const advertiser = await this.findAdvertiser(advertiserId);
    return {
      id: advertiser.id,
      advId: advertiser.advId,
      advName: advertiser.advName,
    };
  }

  async updateAdvertiser(index: string, advId: string, advName: string) {
    const updatedAdvertiser = await this.findAdvertiser(index);
    if (advId) {
      updatedAdvertiser.advId = advId;
    }
    if (advName) {
      updatedAdvertiser.advName = advName;
    }
    updatedAdvertiser.save();
  }

  async deleteAdvertiser(index: string) {
    const existCheck = await this.findAdvertiser(index);
    if (existCheck) {
      await this.advertiserModel.deleteOne({ _id: index }).exec();
    } else {
      throw new NotFoundException('Could not find advertiser.');
    }
  }

  async getAdsList(index: string) {
    try {
      const { data } = await axios.get(
        `https://business-api.tiktok.com/open_api/v1.3/ad/get/?advertiser_id=${index.trim()}`,
        {
          headers: {
            'Access-Token': '7e0908c16e2067dd280a4a8f8398849aa7f38648',
          },
        },
      );
      return {
        success: true,
        adData: data.data.list,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  }

  async setUpdateStatus(
    acoAdIds: string,
    advId: string,
    operationStatus: string,
  ) {
    console.log('service', acoAdIds, advId, operationStatus);
    try {
      const { data } = await axios.post(
        `https://business-api.tiktok.com/open_api/v1.3/ad/status/update/`,
        {
          aco_ad_ids: [acoAdIds],
          advertiser_id: advId,
          operation_status: operationStatus,
        },
        {
          headers: {
            'Access-Token': '7e0908c16e2067dd280a4a8f8398849aa7f38648',
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('service', data);
      return {
        success: true,
        data: data,
      };
    } catch (err) {
      return {
        success: false,
      };
    }
  }

  async getFatigueList(
    advId: string,
    adId: string,
    startDate: string,
    endDate: string,
  ) {
    try {
      const { data } = await axios.get(
        `https://business-api.tiktok.com/open_api/v1.3/creative_fatigue/get/`,
        {
          headers: {
            'Access-Token': '7e0908c16e2067dd280a4a8f8398849aa7f38648',
          },
          data: {
            advertiser_id: advId,
            ad_id: adId,
            filtering: {
              start_date: startDate,
              end_date: endDate,
            },
          },
        },
      );
      return {
        success: true,
        fatigueData: data.data.list,
      };
    } catch (err) {}
  }

  private async findAdvertiser(id: string): Promise<Advertiser> {
    let advertiser;
    try {
      advertiser = await this.advertiserModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find advertiser.');
    }
    if (!advertiser) {
      throw new NotFoundException('Could not find advertiser.');
    }
    return advertiser;
  }
}
