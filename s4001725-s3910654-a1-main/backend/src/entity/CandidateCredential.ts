import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Candidate } from "./Candidate";

@Entity("CandidateCredential")
export class CandidateCredential {
    @PrimaryColumn({ type: "int" })
    candidate_id: number;

    @PrimaryColumn({ type: "varchar", length: 100 })
    degree: string;

    @Column({ type: "varchar", length: 50 })
    level: string; 

    @ManyToOne(() => Candidate, candidate => candidate.credentials, { 
        onDelete: "CASCADE", 
        onUpdate: "CASCADE" 
    })
    @JoinColumn({ name: "candidate_id" })
    candidate: Candidate;
}