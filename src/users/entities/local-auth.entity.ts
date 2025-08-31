import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ schema: 'auth', name: 'LocalAuths' })
export class LocalAuth {
  @PrimaryGeneratedColumn({ name: 'auth_id' })
  authId: number;

  @Column({ name: 'login_id', type: 'varchar', length: 255, unique: true })
  loginId: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;

  @OneToOne(() => User, user => user.localAuth, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: User;
}
