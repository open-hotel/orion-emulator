import { UserDTO } from '../../user/dto/User.dto';
import {
  IsString,
  IsNotEmpty,
  IsPositive,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsArray,
  IsISO8601,
} from 'class-validator';
import { DeepPartial } from '../../core/lib';
import { ApiModelProperty } from '@nestjs/swagger';
import { RoomItem } from './RoomItem.dto';
import { RoomBan } from './RoomBan.dto';
import { classToPlain, Expose } from 'class-transformer';
import { merge } from 'lodash';

export const RoomPrivacyItems = ['public'];
export type RoomPrivacy = 'public' | 'secret';
export type RoomState = 'open' | 'closed';

export class RoomDTO {
  @ApiModelProperty()
  @IsString()
  _id: string;

  @ApiModelProperty()
  @IsString()
  _key: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  caption: string;

  @ApiModelProperty()
  description: string;

  @ApiModelProperty()
  state: RoomState = 'open';

  @ApiModelProperty()
  @IsPositive()
  @IsNumber()
  users_now: number = 0;

  @ApiModelProperty()
  @IsPositive()
  @IsNumber()
  users_max: number = 30;

  @ApiModelProperty()
  owner: UserDTO | string;

  @Expose({ groups: ['owner'] })
  password: string;

  @ApiModelProperty()
  @IsEnum(['public', 'secret'])
  privacy: RoomPrivacy = 'public';

  @ApiModelProperty()
  @IsBoolean()
  doorbell: boolean = false;

  @ApiModelProperty()
  @IsString()
  map: string = '';

  @ApiModelProperty()
  @IsArray()
  items: RoomItem[] = [];

  @Expose({ groups: ['owner'] })
  @ApiModelProperty()
  @IsArray()
  moderators: string[] | UserDTO[] = [];

  @Expose({ groups: ['owner'] })
  @ApiModelProperty()
  @IsArray()
  bans: RoomBan[] = [];

  @ApiModelProperty()
  @IsISO8601()
  created_at: Date = new Date();

  constructor(data: DeepPartial<RoomDTO>) {
    merge(this, data);
  }
}
