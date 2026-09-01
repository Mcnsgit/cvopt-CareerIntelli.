import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'cv_store.json');

export interface DBState {
  master_experiences: any[];
  master_bullets: any[];
  jobs: any[];
  user_qa_logs: any[];
  candidate_info: any;
}

const DEFAULT_STATE: DBState = {
  master_experiences: [],
  master_bullets: [],
  jobs: [],
  user_qa_logs: [],
  candidate_info: {
    name: '',
    email: '',
    phone: '',
    summary: '',
    skills: []
  }
};

export function readDb(): DBState {
  if (!fs.existsSync(DB_PATH)) {
    writeDb(DEFAULT_STATE);
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

export function writeDb(state: DBState) {
  fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2));
}

// Helpers
export function addExperience(exp: any) {
  const db = readDb();
  db.master_experiences.push(exp);
  writeDb(db);
}

export function addBullet(bullet: any) {
  const db = readDb();
  db.master_bullets.push(bullet);
  writeDb(db);
}

export function addJob(job: any) {
  const db = readDb();
  db.jobs.push(job);
  writeDb(db);
}

export function updateCandidateInfo(info: any) {
  const db = readDb();
  db.candidate_info = { ...db.candidate_info, ...info };
  writeDb(db);
}
