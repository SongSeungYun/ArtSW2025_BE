import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';

@Entity({ schema: 'accounts', name: 'local_auths' })
export class LocalAuth {
  @PrimaryGeneratedColumn()
  authId: number;

  @Column({ name: 'login_id', type: 'varchar', length: 255, unique: true })
  loginId: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;

  @Index(['user_id'])
  @OneToOne(() => User, user => user.localAuth, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: User;
}
