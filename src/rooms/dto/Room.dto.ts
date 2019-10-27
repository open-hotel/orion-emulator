import { UserDTO } from '../../user/dto/User.dto';
import {
  IsString,
  IsNotEmpty,
  IsPositive,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsArray
} from 'class-validator';
import { DeepPartial } from '../../core/lib';
import { ApiModelProperty } from '@nestjs/swagger';
import { RoomItem } from './RoomItem.dto';
import { RoomBan } from './RoomBan.dto';

export const RoomPrivacyItems = ['public'];
export type RoomPrivacy = 'public' | 'secret';
export type RoomState = 'open' | 'closed';

export class RoomDTO {
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
  owner: UserDTO | string;
  password: string;

  @ApiModelProperty()
  @IsEnum(['public', 'secret'])
  privacy: RoomPrivacy = 'public';

  @ApiModelProperty()
  @IsBoolean()
  doorbell: boolean = false;

  @ApiModelProperty()
  @IsString()
  map: string = '1,1:1';

  @ApiModelProperty()
  @IsArray()
  items: RoomItem[] = [];

  @ApiModelProperty()
  @IsArray()
  moderators: string[] | UserDTO[] = [];

  @ApiModelProperty()
  @IsArray()
  bans: RoomBan[] = [];

  constructor(data: DeepPartial<RoomDTO>) {
    Object.assign(this, data);
  }
}
