import { Database, DocumentCollection, aql } from 'arangojs';
import { InsertOptions } from 'arangojs/lib/cjs/util/types';
import { QueryOptions } from 'arangojs/lib/cjs/database';
import { AqlLiteral } from 'arangojs/lib/cjs/aql-query';
import Aqb from 'aqb'

interface Keyable {
  _key: number
}

export class ArangoCrudService<T extends object = Keyable> {
  public readonly collection: DocumentCollection<T>;

  constructor(protected readonly db: Database, public readonly name: string) {
    this.collection = db.collection(name);
  }


  filterBy(field: string, value: any): Promise<T> {
    return this.db
      .query(`FOR item IN ${this.collection.name} FILTER item.${field} == @value RETURN item`, { value })
      .then(cursor => cursor.all())
  }

  getByKey(keyOrId: string | number) {
    return this.db
      .query(`RETURN DOCUMENT(${this.collection.name}/${keyOrId})`)
      .then(cursor => cursor.all())
  }

  save(data: T): Promise<T> {
    return this.db
      .query(`INSERT @data INTO ${this.collection.name} RETURN NEW`, { data })
      .then(cursor => cursor.all())
  }

  update(data: T) {
    return this.db
      .query(`UPDATE @data IN collection ${this.collection.name}`, { data })
      .then(cursor => cursor.all())
  }
}
