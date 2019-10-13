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
}
