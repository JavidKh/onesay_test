import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ResetToken {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  token: string;

  @Column({ default: false })
  public isConfirmed: boolean;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @ManyToOne(() => User, (user) => user.resetTokens)
  user: User;
}
