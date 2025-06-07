import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  price: number;
}
