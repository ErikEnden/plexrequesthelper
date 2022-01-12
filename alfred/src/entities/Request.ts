import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { User } from './User';

@Entity()
export class Request extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.requests)
    requester: User;

    @Column()
    tmdb_id: string;

    @Column("int")
    status: Number;
}
