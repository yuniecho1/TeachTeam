import { Entity, PrimaryColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Course } from "./Course";
import { ApplicationChosen } from "./ApplicationChosen";
import { ApplicationComment } from "./ApplicationComment";

@Entity("Lecturer")
export class Lecturer {
    @PrimaryColumn()
    user_id: number;

    @OneToOne(() => User, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(() => Course, course => course.lecturer)
    courses: Course[];

    @OneToMany(() => ApplicationChosen, chosen => chosen.lecturer)
    applicationChosen: ApplicationChosen[];

    @OneToMany(() => ApplicationComment, comment => comment.lecturer)
    applicationComments: ApplicationComment[];
}