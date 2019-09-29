export interface FurnitureUserCapabilities {
    can_stack: boolean;
    can_sit: boolean;
    is_walkable: boolean;
    can_lay: boolean;
}
export interface FurnitureCapabilities {
    can_recycle: boolean;
    allow_trade: boolean;
    allow_gift: boolean;
    allow_inventory_stack: boolean;
}
export interface FurnitureInfo {
    public_name: string;
    item_name: string;
    sprite_if: string;
    description: string;
}
export interface FurnitureDimentions {
    width: number;
    length: number;
    stack_height: number;
}
export interface Furniture extends FurnitureInfo, FurnitureUserCapabilities, FurnitureCapabilities, FurnitureDimentions {
}
