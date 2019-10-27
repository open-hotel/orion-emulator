import { IsDate, IsOptional, IsString } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";
import { UserDTO } from "../../user/dto/User.dto";

export class RoomBan {
  @ApiModelProperty()
  @IsString()
  author: string | UserDTO;

  @ApiModelProperty()
  @IsString()
  user: string | UserDTO;

  @ApiModelProperty()
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