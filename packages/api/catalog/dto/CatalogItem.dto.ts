import { FurnitureDTO } from "../../furni/dto/Furniture.dto";
import { UserCreditsDTO } from "../../user/dto/User.dto";
import { CatalogItemOffer } from "./CatalogItemOffer.dto";

export class CatalogItemDTO {
  type: string = 'furni'
  item: FurnitureDTO | any
  limited: boolean = false
  stock: number = 0
  price: UserCreditsDTO = {
    credits: 0,
    diamonds: 0,
    duckets: 0
  }
  offers: CatalogItemOffer[] = []
}