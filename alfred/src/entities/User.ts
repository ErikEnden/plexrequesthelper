import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { Request } from "./Request";

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

    @OneToMany(() => Request, request => request.requester)
    requests: Request[];
}