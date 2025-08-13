import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Candidate } from "./Candidate";
import { Skill } from "./Skill";

@Entity("CandidateSkill")
export class CandidateSkill {
    @PrimaryColumn({ type: "int" })
    candidate_id: number;

    @PrimaryColumn({ type: "int" })
    skill_id: number;

    @ManyToOne(() => Candidate, candidate => candidate.skills, { 
        onDelete: "CASCADE", 
        onUpdate: "CASCADE" 
    })
    @JoinColumn({ name: "candidate_id" })
    candidate: Candidate;

    @ManyToOne(() => Skill, skill => skill.candidateSkills, { 
        onDelete: "CASCADE", 
        onUpdate: "CASCADE" 
    })
    @JoinColumn({ name: "skill_id" })
    skill: Skill;
}