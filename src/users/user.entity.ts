import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert(id: string) {
    console.log('Insert new user', id);
  }

  @AfterUpdate()
  logUpdate(id: string) {
    console.log('Update user', id);
  }

  @AfterRemove()
  logRemove(id: string) {
    console.log('Remove user', id);
  }
}
