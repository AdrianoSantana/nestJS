import { isBoolean, isDefined, IsEnum, isIn } from 'class-validator';
import { User } from 'src/user/user.entity';
import { Column, Entity, ForeignKey, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  price: number;

  @Column()
  make: string

  @Column()
  model: string

  @Column()
  mileage: number

  @Column()
  year: number

  @Column()
  lng: number

  @Column()
  lat: number

  @ManyToOne(() => User, (user) => user.reports)
  user: User

  @Column({
    type: 'text',
    enum: ['DOLAR', 'REAL'],
    default: 'DOLAR'
  })
  coin: string

  @Column({ default: false })
  approved: boolean
}
