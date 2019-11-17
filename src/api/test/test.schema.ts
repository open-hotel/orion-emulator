import { Schema, Property } from "../arango-schema/decorators/entity";

@Schema()
export class Test {
  @Property()
  id: string

  @Property()
  name:string
}