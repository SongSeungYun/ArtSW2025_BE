import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { LocalAuth } from './local-auth.entity';
import { SocialAuth } from './social-auth.entity';

@Entity({ schema: 'auth', name: 'Users' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 320, unique: true, nullable: true })
  email: string;

  @Column({ name: 'is_admin', type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => LocalAuth, localAuth => localAuth.user)
  localAuth: LocalAuth;

  @OneToMany(() => SocialAuth, socialAuth => socialAuth.user)
  socialAuths: SocialAuth[];
}
