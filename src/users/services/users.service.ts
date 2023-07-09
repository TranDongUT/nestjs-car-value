import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserEntity } from './../user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
  ) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async findOne(id: string) {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Not Found');
    }
    return user;
  }

  async find(email: string) {
    const user = await this.repo.find({ where: { email: Like(`%${email}%`) } });
    return user;
  }

  async update(id: string, body: Partial<UserEntity>) {
    const userUpdate = await this.findOne(id);

    Object.assign(userUpdate, body);
    return this.repo.save(userUpdate);
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    return this.repo.remove(user);
  }
}
