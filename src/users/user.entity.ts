import { ReportEntity } from './../reports/report.entity';
import { Exclude } from 'class-transformer';
import { Role } from 'src/enums/role.enum';
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

  // @AfterInsert()
  // logInsert(id: string) {
  //   console.log('Insert new user', id);
  // }

  // @AfterUpdate()
  // logUpdate(id: string) {
  //   console.log('Update user', id);
  // }

  // @AfterRemove()
  // logRemove(id: string) {
  //   console.log('Remove user', id);
  // }

  @OneToMany(() => ReportEntity, (report) => report.user)
  reports: ReportEntity[];

  @Column({ default: Role.USER })
  role: string;
}
