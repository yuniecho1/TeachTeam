import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Lecturer } from "./Lecturer";
import { Application } from "./Application";

@Entity("ApplicationComment")
export class ApplicationComment {
    @PrimaryColumn({ type: "int" })
    lecturer_id: number;

    @PrimaryColumn({ type: "int" })
    application_id: number;

    @Column({ type: "text" })
    comment: string;

    @ManyToOne(() => Lecturer, lecturer => lecturer.applicationComments, { 
        onDelete: "CASCADE", 
        onUpdate: "CASCADE" 
    })
    @JoinColumn({ name: "lecturer_id" })
    lecturer: Lecturer;

    @ManyToOne(() => Application, application => application.applicationComments, { 
        onDelete: "CASCADE", 
        onUpdate: "CASCADE" 
    })
    @JoinColumn({ name: "application_id" })
    application: Application;
}