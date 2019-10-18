import { ApiModelProperty } from "@nestjs/swagger";
import { DeepPartial } from "../../../core/lib/DeepPartial";
import { Client } from "oauth2-server";

export type UserGender = 'M' | 'F'

export class UserProfileDTO {
  @ApiModelProperty()
  real_name: string;
  
  @ApiModelProperty()
  look: string;
  
  @ApiModelProperty()
  gender: UserGender;
  
  @ApiModelProperty()
  motto: string = '';
  
  @ApiModelProperty()
  respect: number = 10;
  
  @ApiModelProperty({ type: 'string', format: 'date' })
  birthday: Date
}

export class UserAccountDTO {
  @ApiModelProperty()
  username: string;
  
  @ApiModelProperty({ format: 'password' })
  password: string;
  
  @ApiModelProperty()
  email: string;
  
  @ApiModelProperty()
  rank: number = 0;
  
  @ApiModelProperty({ type: 'string', format: 'date-time' })
  last_online: Date;
  
  @ApiModelProperty({ type: 'string', format: 'date-time' })
  last_login: Date;
  
  @ApiModelProperty()
  ip_last: string;
  
  @ApiModelProperty()
  ip_reg: string;
  
  @ApiModelProperty()
  mail_verified: boolean = false;
  
  @ApiModelProperty()
  vip: boolean = false;
  
  @ApiModelProperty()
  online: boolean = false;

  @ApiModelProperty()
  oauth: {
    access_token: string;
    refresh_token: string;
    access_token_expire_timestamp: number;
    refresh_token_expire_timestamp: number;
    client: Client & { secret: string }
  }
}

export class UserConfigDTO {
  @ApiModelProperty()
  daily_respect_points: number = 10; 
  
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
  
  @ApiModelProperty()
  client_volume: number = 1;
  
  @ApiModelProperty()
  accept_trading: boolean = true;
  
  @ApiModelProperty()
  whisper_enabled: boolean = true;
  
  @ApiModelProperty()
  can_change_name: boolean = false;
}

export class UserCreditsDTO {
  @ApiModelProperty()
  credits: number = 0;

  @ApiModelProperty()
  duckets: number = 0;

  @ApiModelProperty()
  diamonds: number = 0;
}

export class UserDTO {
  @ApiModelProperty()
  _key: number

  @ApiModelProperty()
  profile: UserProfileDTO = new UserProfileDTO;
  
  @ApiModelProperty()
  account: UserAccountDTO = new UserAccountDTO;
  
  @ApiModelProperty()
  config: UserConfigDTO = new UserConfigDTO;
  
  @ApiModelProperty()
  credits: UserCreditsDTO = new UserCreditsDTO;

  @ApiModelProperty()
  auth_ticket: string;

  constructor (data:DeepPartial<UserDTO>) {
    Object.assign(this, data)
  }
}