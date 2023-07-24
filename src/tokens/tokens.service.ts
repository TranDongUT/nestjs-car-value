import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from './token.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/user.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(TokenEntity) private repo: Repository<TokenEntity>,
  ) {}

  saveToken(refreshToken: string, user: UserEntity) {
    const newToken = this.repo.create({ refreshToken, userId: user.id });
    return this.repo.save(newToken);
  }

  async findAll(user: UserEntity) {
    const [tokens, countTokens] = await this.repo.findAndCount({
      where: {
        userId: user.id,
      },
      order: {
        createAt: 'ASC',
      },
    });

    return [tokens, countTokens];
  }

  async removeToken(refreshToken: string) {
    const token = await this.repo.findOneBy({ refreshToken });
    if (!token) {
      throw new Error('Not Found Refresh Token');
    }

    return this.repo.remove(token);
  }
}
