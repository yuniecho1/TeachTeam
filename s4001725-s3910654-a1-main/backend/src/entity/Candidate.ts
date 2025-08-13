import { Entity, PrimaryColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Application } from "./Application";
import { CandidateCredential } from "./CandidateCredential";
import { CandidateSkill } from "./CandidateSkill";
import { CandidatePrevRole } from "./CandidatePrevRole";

@Entity("Candidate")
export class Candidate {
    @PrimaryColumn()
    user_id: number;

    @OneToOne(() => User, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(() => Application, application => application.candidate)
    applications: Application[];

    @OneToMany(() => CandidateCredential, credential => credential.candidate)
    credentials: CandidateCredential[]; 

    @OneToMany(() => CandidateSkill, candidateSkill => candidateSkill.candidate)
    skills: CandidateSkill[];

    @OneToMany(() => CandidatePrevRole, prevRole => prevRole.candidate)
    prevRoles: CandidatePrevRole[]; 
}