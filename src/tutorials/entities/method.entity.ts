import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Method')
export class Method {
  @PrimaryGeneratedColumn()
  method_id: number;

  @Column({ type: 'varchar', length: 50 })
  method_name: string;
}
