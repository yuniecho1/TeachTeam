import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Candidate } from "./Candidate";
import { Course } from "./Course";

@Entity("CandidatePrevRole")
export class CandidatePrevRole {
    @PrimaryColumn({ type: "int" })
    candidate_id: number;

    @PrimaryColumn({ type: "int" })
    course_id: number;

    @ManyToOne(() => Candidate, candidate => candidate.prevRoles, { 
        onDelete: "CASCADE", 
        onUpdate: "CASCADE" 
    })
    @JoinColumn({ name: "candidate_id" })
    candidate: Candidate;

    @ManyToOne(() => Course, course => course.prevRoles, {
        onDelete: "CASCADE", 
        onUpdate: "CASCADE" 
    })
    @JoinColumn({ name: "course_id" })
    course: Course;
}