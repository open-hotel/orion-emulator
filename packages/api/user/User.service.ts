import { ArangoCrudService } from '../lib/ArangoCrudService';
import { Database } from 'arangojs';
import { InjectArango } from '../lib/injectArango.decorator';
import { Injectable } from '@nestjs/common';
import { UserRegisterDTO } from './dto/UserRegister.dto';
import { UserDTO, UserAccountDTO } from './dto/User.dto';

@Injectable()
export class UserService extends ArangoCrudService<UserDTO> {
  constructor(
    @InjectArango()
    db: Database,
  ) {
    super(db, 'users');
  }

  async findByUsernameAndPassword (username:string, password: string) {
    const user: UserDTO = await this.db.query(`
      FOR user in ${this.collection.name}
        FILTER user.account.username == @username
        LIMIT 1
        RETURN user
    `, { username }).then(c => c.next())

    if (user && user.account.password === password) return user
    return null
  }
}
