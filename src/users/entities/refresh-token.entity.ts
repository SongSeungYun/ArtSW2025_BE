import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ schema: 'accounts', name: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryGeneratedColumn({ name: 'refresh_token_id' })
  refreshTokenId: number;

  @Column({ name: 'refresh_token', type: 'text' })
  hashedRefreshToken: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
