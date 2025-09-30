import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';

@Entity({ schema: 'accounts', name: 'social_auths' })
export class SocialAuth {
  @PrimaryGeneratedColumn()
  socialAuthId: number;

  @Column({ type: 'varchar', length: 50 })
  provider: string; // 'google', 'kakao' 등

  @Column({ name: 'provider_user_id', type: 'varchar', length: 255 })
  providerUserId: string;

  @Index(['user_id'])
  @ManyToOne(() => User, user => user.socialAuths, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
