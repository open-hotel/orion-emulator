import { Database, DocumentCollection, aql } from 'arangojs';
import { InsertOptions } from 'arangojs/lib/cjs/util/types';

export class ArangoCrudService<T extends object = any> {
  public readonly collection: DocumentCollection<T>;

  constructor(public readonly db: Database, public readonly name: string) {
    this.collection = db.collection(name);
  }

  save(data: T): Promise<T> {
    return this.db
      .query(`INSERT @data INTO ${this.collection.name} RETURN NEW`, { data })
      .then(cursor => cursor.next());
  }
}
