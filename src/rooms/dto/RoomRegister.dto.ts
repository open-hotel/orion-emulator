import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class RoomRegisterDTO {
  @ApiModelProperty()
  @IsString()
  caption: string;

  @ApiModelProperty()
  @IsString()
  description: string;

  @ApiModelProperty()
  @IsString()
  map: string;
}
