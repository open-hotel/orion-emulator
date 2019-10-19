import { Database, DocumentCollection, aql } from 'arangojs';
import { InsertOptions } from 'arangojs/lib/cjs/util/types';
import { QueryOptions } from 'arangojs/lib/cjs/database';
import { AqlLiteral } from 'arangojs/lib/cjs/aql-query';

export class ArangoCrudService<T extends object = any> {
  public readonly collection: DocumentCollection<T>;

  constructor(protected readonly db: Database, public readonly name: string) {
    this.collection = db.collection(name);
  }

  save(data: T): Promise<T> {
    return this.db
      .query(`INSERT @data INTO ${this.collection.name} RETURN NEW`, { data })
      .then(cursor => cursor.next());
  }
}
