import { UserBalanceDTO } from "../../user/dto/User.dto"

export class CatalogItemVipDTO {
  days: number
  price: UserBalanceDTO = {
    credits: 0,
    diamonds: 0,
    duckets: 0
  }
}