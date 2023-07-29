import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// services

import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/services/users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
    private tokensService: TokensService,
  ) {}

  private maxCountRefreshToken = 5;

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
      throw new NotFoundException('Wrong email or pass');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('Wrong email or pass');
    }

    const access_token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    // refreshtoken
    const refresh_token = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
      },
      {
        secret: process.env.REFRESH_JWT,
        expiresIn: '1h',
      },
    );

    // remove oldes tokens
    const [tokens, countTokens] = await this.tokensService.findAll(user);

    if (Number(countTokens) >= this.maxCountRefreshToken) {
      const oldesToken = tokens[0];
      await this.tokensService.removeToken(oldesToken.refreshToken);
    }

    // store to db
    await this.tokensService.saveToken(refresh_token, user);

    return {
      ...user,
      access_token,
      refresh_token,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_JWT,
      });

      const user = await this.UsersService.findOne(payload.id);

      const newAccessToken = await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
      });

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async signout(refreshToken: string) {
    try {
      return await this.tokensService.removeToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
