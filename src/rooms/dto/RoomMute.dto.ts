import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsDate, IsString } from "class-validator";
import { UserDTO } from "../../user/dto/User.dto";

export class RoomMute {
  @ApiModelProperty()
  @IsString()
  author: string | UserDTO;

  @ApiModelProperty()
  @IsString()
  user: string | UserDTO;

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString()
  reason: string;

  @ApiModelProperty()
  @IsDate()
  date_time: Date = new Date();

  @ApiModelProperty()
  @IsOptional()
  @IsDate()
  ends_in: Date;
}