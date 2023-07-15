import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    // check email is used
    const user = await this.UsersService.find(email);
    if (user.length) {
      throw new BadRequestException('Email in use');
    }

    // hash password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    // store to db
    return this.UsersService.create(email, result);
  }

  async signin(email: string, password: string) {
    const [user] = await this.UsersService.find(email);
    if (!user) {
      throw new NotFoundException('Not found email');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('Wrong pass');
    }

    const access_token = await this.jwtService.signAsync({
      payload: { id: user.id, email: user.email },
    });

    return {
      ...user,
      access_token,
    };
  }
}
