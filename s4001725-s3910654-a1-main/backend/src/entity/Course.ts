import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Lecturer } from "./Lecturer";
import { Application } from "./Application";
import { CandidatePrevRole } from "./CandidatePrevRole";

@Entity("Course")
export class Course {
    @PrimaryGeneratedColumn()
    course_id: number;

    @Column({ type: "varchar", length: 200 })
    course_name: string;

    @Column({ type: "int" })
    lecturer_id: number;

    @ManyToOne(() => Lecturer, lecturer => lecturer.courses, { 
        onDelete: "RESTRICT", 
        onUpdate: "CASCADE" 
    })
    @JoinColumn({ name: "lecturer_id" })
    lecturer: Lecturer;

    @OneToMany(() => Application, application => application.course)
    applications: Application[];

    @OneToMany(() => CandidatePrevRole, prevRole => prevRole.course)
    prevRoles: CandidatePrevRole[]; 
}