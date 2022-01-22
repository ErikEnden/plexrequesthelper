import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany
} from 'typeorm';
import { MediaRequest } from './MediaRequest';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column()
  is_admin: boolean;

  @Column({ type: 'date', nullable: true })
  last_login: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => MediaRequest, (request) => request.requester)
  requests: Request[];
}
