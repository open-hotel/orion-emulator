import { IsString, IsNotEmpty, IsEmail, IsISO8601, IsEnum, IsIn } from 'class-validator'
import { ApiModelProperty } from '@nestjs/swagger'
import { UserGender } from '../../../common'

export class UserRegisterDTO {
  @ApiModelProperty()
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiModelProperty({
    enum: ['M', 'F']
  })
  @IsIn(['M', 'F'])
  @IsString()
  gender: UserGender

  @ApiModelProperty()
  @IsNotEmpty()
  @IsISO8601()
  birthday: string
}