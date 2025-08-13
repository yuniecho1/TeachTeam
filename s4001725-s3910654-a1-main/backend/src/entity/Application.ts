import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Candidate } from "./Candidate";
import { Course } from "./Course";
import { ApplicationChosen } from "./ApplicationChosen";
import { ApplicationComment } from "./ApplicationComment";

@Entity("Application")
export class Application {
    @PrimaryGeneratedColumn()
    application_id: number;

    @Column({ type: "int" })
    candidate_id: number;

    @Column({ type: "int" })
    course_id: number;

    @Column({ 
        type: "enum", 
        enum: ["part_time", "full_time"] 
    })
    availability: "part_time" | "full_time";

    @Column({ 
        type: "enum", 
        enum: ["lab_assistant", "tutor"] 
    })
    applied_role: "lab_assistant" | "tutor";

    @Column({ type: "int", unique: true })
    rank: number;

    @ManyToOne(() => Candidate, candidate => candidate.applications, { 
        onDelete: "CASCADE", 
        onUpdate: "CASCADE" 
    })
    @JoinColumn({ name: "candidate_id" })
    candidate: Candidate;

    @ManyToOne(() => Course, course => course.applications, { 
        onDelete: "CASCADE", 
        onUpdate: "CASCADE" 
    })
    @JoinColumn({ name: "course_id" })
    course: Course;

    @OneToMany(() => ApplicationChosen, chosen => chosen.application)
    applicationChosen: ApplicationChosen[];

    @OneToMany(() => ApplicationComment, comment => comment.application)
    applicationComments: ApplicationComment[];
}