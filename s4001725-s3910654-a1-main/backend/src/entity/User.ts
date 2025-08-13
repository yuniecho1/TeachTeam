import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("User")
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ type: "varchar", length: 100, unique: true })
    username: string;

    @Column({ type: "varchar", length: 255 })
    password: string;

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "varchar", length: 100 })
    surname: string;

    @CreateDateColumn({ type: 'timestamp' })
    dateJoined: Date;
}