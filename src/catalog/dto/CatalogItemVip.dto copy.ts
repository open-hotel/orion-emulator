import { UserCreditsDTO } from "../../user/dto/User.dto"

export class CatalogItemVipDTO {
  days: number
  price: UserCreditsDTO = {
    credits: 0,
    diamonds: 0,
    duckets: 0
  }
}