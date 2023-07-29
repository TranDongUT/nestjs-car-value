import { timeStamp } from 'console';
import { UserEntity } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  refreshToken: string;

  @CreateDateColumn()
  createAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.refreshToken)
  user: UserEntity;
}
