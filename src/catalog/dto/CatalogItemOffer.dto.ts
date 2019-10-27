import { UserCreditsDTO } from "../../user/dto/User.dto"

export class CatalogItemOffer {
  amount: number = 0
  price: UserCreditsDTO = {
    credits: 0,
    diamonds: 0,
    duckets: 0
  }
  expires: Date
}