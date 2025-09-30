import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('monthly_prompts', { schema: 'board' })
export class MonthlyPrompt {
  @PrimaryGeneratedColumn()
  monthly_prompt_id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at: Date;
}