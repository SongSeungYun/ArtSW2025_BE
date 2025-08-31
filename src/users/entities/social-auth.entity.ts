import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ schema: 'auth', name: 'SocialAuths' })
export class SocialAuth {
  @PrimaryGeneratedColumn({ name: 'social_auth_id' })
  socialAuthId: number;

  @Column({ type: 'varchar', length: 50 })
  provider: string; // 'google', 'kakao' 등

  @Column({ name: 'provider_user_id', type: 'varchar', length: 255 })
  providerUserId: string;

  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken: string;

  @ManyToOne(() => User, user => user.socialAuths, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
