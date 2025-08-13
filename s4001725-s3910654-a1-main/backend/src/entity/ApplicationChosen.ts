import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Lecturer } from "./Lecturer";
import { Application } from "./Application";

@Entity("ApplicationChosen")
export class ApplicationChosen {
    @PrimaryColumn({ type: "int" })
    lecturer_id: number;

    @PrimaryColumn({ type: "int" })
    application_id: number;

    @ManyToOne(() => Lecturer, lecturer => lecturer.applicationChosen, { 
        onDelete: "CASCADE", 
        onUpdate: "CASCADE" 
    })
    @JoinColumn({ name: "lecturer_id" })
    lecturer: Lecturer;

    @ManyToOne(() => Application, application => application.applicationChosen, { 
        onDelete: "CASCADE", 
        onUpdate: "CASCADE" 
    })
    @JoinColumn({ name: "application_id" })
    application: Application;
}