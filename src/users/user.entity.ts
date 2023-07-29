import { ReportEntity } from './../reports/report.entity';
import { Exclude } from 'class-transformer';
import { Role } from 'src/enums/role.enum';
import { TokenEntity } from 'src/tokens/token.entity';

import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => ReportEntity, (report) => report.user)
  reports: ReportEntity[];

  @Column({ default: Role.USER })
  role: string;

  @OneToMany(() => TokenEntity, (token) => token.user)
  refreshToken: TokenEntity[];
}
