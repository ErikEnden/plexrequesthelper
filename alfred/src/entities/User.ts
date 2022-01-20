import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { MediaRequest } from "./MediaRequest";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() 
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    isAdmin: boolean;

    @Column({type: 'date', nullable: true})
    last_login: string;

    @OneToMany(() => MediaRequest, request => request.requester)
    requests: Request[];
}