import { IsString, IsNotEmpty, IsNumber, IsBoolean } from "class-validator"
import { DeepPartial } from "../../../core/lib/DeepPartial"

export class FurnitureDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  public_name: string = ''
  
  @IsNotEmpty()
  @IsString()
  description: string = ''
  
  @IsNotEmpty()
  @IsString()
  sprite_id: string = '0'

  @IsNumber()
  width: number = 0

  @IsNumber()
  length: number = 0
  
  @IsNumber()
  height: number = 0
  
  @IsBoolean()
  can_recycle: boolean = false
  
  @IsBoolean()
  allow_trade: boolean = true
  
  @IsBoolean()  
  allow_gift: boolean = true
  
  @IsBoolean()
  allow_inventory_stack: boolean = true
  
  @IsBoolean()  
  can_stack: boolean = false
    
  @IsBoolean()
  can_sit: boolean = false
  
  @IsBoolean()
  is_walkable: boolean = false
  
  @IsBoolean()
  can_lay: boolean = false

  constructor (data:DeepPartial<FurnitureDTO>) {
    Object.assign(this, data)
  }
}