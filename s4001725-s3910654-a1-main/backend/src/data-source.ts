import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import {
  User,
  Admin,
  Lecturer,
  Candidate,
  Course,
  Skill,
  Application,
  CandidateCredential,
  CandidatePrevRole,
  CandidateSkill,
  ApplicationChosen,
  ApplicationComment
} from './entity'; 
  
export const AppDataSource = new DataSource({
    type: "mysql", 
    host: "209.38.26.237",
    port: 3306,
    username: "S3910654",
    password: "S3910654",
    database: "S3910654",
    synchronize: true, 
    logging: true,
    entities: [
        User,
        Admin,
        Lecturer,
        Candidate,
        Course,
        Skill,
        Application,
        CandidateCredential,
        CandidatePrevRole,
        CandidateSkill,
        ApplicationChosen,
        ApplicationComment
      ],
      migrations: ["src/migration/**/*.ts"],
      subscribers: ["src/subscriber/**/*.ts"],
});