import { FurnitureDTO } from "../../furni/dto/Furniture.dto";
import { UserBalanceDTO } from "../../user/dto/User.dto";
import { CatalogItemOffer } from "./CatalogItemOffer.dto";

export class CatalogItemDTO {
  type: string = 'furni'
  item: FurnitureDTO | any
  limited: boolean = false
  stock: number = 0
  price: UserBalanceDTO = {
    credits: 0,
    diamonds: 0,
    duckets: 0
  }
  offers: CatalogItemOffer[] = []
}