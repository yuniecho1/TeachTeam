import { Entity, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("Admin")
export class Admin {
    @PrimaryColumn()
    user_id: number;

    @OneToOne(() => User, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;
}