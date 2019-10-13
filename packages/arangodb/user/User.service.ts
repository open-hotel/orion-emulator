import { ArangoCrudService } from '../lib/ArangoCrudService';
import { IUser } from './User.interface';
import { Database } from 'arangojs';
import { InjectArango } from '../lib/injectArango.decorator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService extends ArangoCrudService<IUser> {
  constructor(
    @InjectArango()
    db: Database,
  ) {
    super(db, 'users');
  }
}
