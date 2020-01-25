import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { merge } from 'lodash';
import { classToPlain } from 'class-transformer';
import { DeepPartial } from '../../core/lib';

export type UserGender = 'M' | 'F';

export class UserProfileDTO {
  @ApiModelProperty()
  real_name: string = null;

  @ApiModelProperty()
  figure: string = 'hd-180-1.hr-828-61.ch-215-63.lg-270-110.sh-3089-62';

  @ApiModelProperty()
  gender: UserGender = 'M';

  @ApiModelProperty()
  motto: string = null;

  @Expose({ groups: ['user', 'admin'] })
  @ApiModelProperty()
  respect: number = 10;

  @Expose({ groups: ['user', 'admin'] })
  @ApiModelProperty({ type: 'string', format: 'date' })
  birthday: Date = new Date();
}

export class UserAccountDTO {
  @ApiModelProperty()
  username: string = null;

  @Expose({ groups: ['app', 'admin'] })
  @ApiModelProperty({ format: 'password' })
  password: string = null;

  @Expose({ groups: ['user', 'admin'] })
  @ApiModelProperty()
  email: string = null;

  @ApiModelProperty()
  rank: number = 0;

  @ApiModelProperty({ type: 'string', format: 'date-time' })
  last_online: Date = new Date();

  @ApiModelProperty({ type: 'string', format: 'date-time' })
  last_login: Date = new Date();

  @Expose({ groups: ['admin'] })
  @ApiModelProperty()
  ip_last: string = null;

  @Expose({ groups: ['admin'] })
  @ApiModelProperty()
  ip_reg: string = null;

  @Expose({ groups: ['admin'] })
  @ApiModelProperty()
  mail_verified: boolean = false;

  @ApiModelProperty()
  vip: boolean = false;

  @ApiModelProperty()
  online: boolean = false;

  constructor (data: DeepPartial<UserAccountDTO> = {}) {
    merge(this, data)
  }
}

export class UserConfigDTO {
  @Expose({ groups: ['admin'] })
  @ApiModelProperty()
  daily_respect_points: number = 10;

  @Expose({ groups: ['admin'] })
  @ApiModelProperty()
  daily_pet_respect_points: number = 10;

  @ApiModelProperty()
  is_muted: boolean = false;

  @ApiModelProperty()
  block_new_friends: boolean = false;

  @ApiModelProperty()
  hide_online: boolean = false;

  @ApiModelProperty()
  block_follow: boolean = false;

  @ApiModelProperty()
  hide_inroom: boolean = false;

  @Expose({ groups: ['user', 'admin'] })
  @ApiModelProperty()
  client_volume: number = 1;

  @ApiModelProperty()
  accept_trading: boolean = true;

  @ApiModelProperty()
  whisper_enabled: boolean = true;

  @Expose({ groups: ['admin'] })
  @ApiModelProperty()
  can_change_name: boolean = false;
}

export class UserBalanceDTO {
  @ApiModelProperty()
  credits: number = 0;

  @ApiModelProperty()
  duckets: number = 0;

  @ApiModelProperty()
  diamonds: number = 0;
}

export class UserDTO {
  @ApiModelProperty()
  _id: string;

  @ApiModelProperty()
  _key: string;

  @ApiModelProperty()
  profile: UserProfileDTO = new UserProfileDTO();

  @ApiModelProperty()
  account: UserAccountDTO = new UserAccountDTO();

  @ApiModelProperty()
  config: UserConfigDTO = new UserConfigDTO();

  @Expose({ groups: ['user', 'admin'] })
  @ApiModelProperty()
  balance: UserBalanceDTO = new UserBalanceDTO();

  @Expose({ groups: ['app', 'admin'] })
  @ApiModelProperty()
  auth_ticket: string = null;

  constructor(data: DeepPartial<UserDTO>) {
    merge(this, data);
  }
}
