import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn
} from 'typeorm';
import { User } from './User';
import Status from 'src/router/types/status';
@Entity()
export class MediaRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  requester: User;

  @Column({ type: 'date', nullable: true })
  created_at: string;

  @Column({ nullable: false, unique: true })
  tmdb_id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  release_date: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  poster_url: string;

  @Column('int', { nullable: false })
  status: Status;

  @Column({ nullable: true })
  media_type: string;
}
