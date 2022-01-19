import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { User } from './User';
import Status from 'src/router/types/status';
@Entity()
export class MediaRequest extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.requests, {nullable: false})
    requester: User;

    @Column({type: 'date', nullable: true})
    created_at: string;

    @Column({unique: true, nullable: false})
    tmdb_id: string;
    
    @Column({nullable: false})
    title: string;
    
    @Column({nullable: true})
    release_date: string;

    @Column({nullable: true})
    notes: string;

    @Column({nullable: true})
    poster_url: string;

    @Column("int", {nullable: false})
    status: Status;
}
