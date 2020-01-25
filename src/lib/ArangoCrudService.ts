import { Database, DocumentCollection, aql } from 'arangojs';
import { InsertOptions } from 'arangojs/lib/cjs/util/types';
import { QueryOptions } from 'arangojs/lib/cjs/database';
import { AqlLiteral } from 'arangojs/lib/cjs/aql-query';
import Aqb from 'aqb'
import { UserDTO } from '../user/dto/User.dto';
import { DeepPartial } from '../core/lib';

interface Keyable {
  _id: string,
  _key: string
}

export class ArangoCrudService<T extends Keyable> {
  public readonly collection: DocumentCollection<T>;

  constructor(protected readonly db: Database, public readonly name: string) {
    this.collection = db.collection(name);
  }


  filterBy(field: string, value: any): Promise<T> {
    return this.db
      .query(`FOR item IN ${this.collection.name} FILTER item.${field} == @value RETURN item`, { value })
      .then(cursor => cursor.all())
  }

  getByKey(keyOrId: string): Promise<any> {
    const id = [this.collection.name, keyOrId].join('/')
    const q = aql`RETURN DOCUMENT(${id})`;
    return this.db
      .query(q)
      .then(c => c.next())
  }

  save(data: DeepPartial<T>): Promise<T> {
    return this.db
      .query(`INSERT @data INTO ${this.collection.name} RETURN NEW`, { data })
      .then(cursor => cursor.next())
  }

  update(data: DeepPartial<T> & Keyable) {
    return this.db.collection(this.collection.name).update({
      _key: data._key
    }, data)
  }
}
