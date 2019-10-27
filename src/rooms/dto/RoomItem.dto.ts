import { ApiModelProperty } from "@nestjs/swagger";
import { UserDTO } from "../../user/dto/User.dto";
import { FurnitureDTO } from "../../furni/dto/Furniture.dto";

export class RoomItem<T = any> {
  @ApiModelProperty()
  owner: string | UserDTO;

  @ApiModelProperty()
  base: string | FurnitureDTO;

  @ApiModelProperty()
  extra_data: T;

  @ApiModelProperty()
  x: number;

  @ApiModelProperty()
  y: number;

  @ApiModelProperty()
  z: number;

  @ApiModelProperty()
  rot: number;

  @ApiModelProperty()
  wall_pos: number;
}