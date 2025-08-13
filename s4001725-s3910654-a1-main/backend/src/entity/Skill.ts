import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CandidateSkill } from "./CandidateSkill";

@Entity("Skill")
export class Skill {
    @PrimaryGeneratedColumn()
    skill_id: number;

    @Column({ type: "varchar", length: 100 })
    skill_name: string;

    @OneToMany(() => CandidateSkill, candidateSkill => candidateSkill.skill)
    candidateSkills: CandidateSkill[];
}