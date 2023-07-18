import { UserEntity } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  kilometer: number;

  @Column()
  price: number;

  @ManyToOne(() => UserEntity, (user) => user.reports)
  user: UserEntity;

  @Column({ default: false })
  isApprove: boolean;
}
