export interface Company {
  id: string;
  name: string;
  website?: string;
  role?: 'owner' | 'member';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
  photo_url?: string;
  companies?: Company[];
  intent_text?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

export interface SystemMetrics {
  overview: {
    total_swipes: number;
    total_matches: number;
    match_rate: string;
    active_jobs: number;
    active_candidates: number;
  };
  timestamp: string;
}

export interface AIKeyResponse {
  status: string;
  new_key: string;
  message: string;
  generated_at: string;
}

export interface Candidate {
  candidate_id: string;
  intent_text: string;
  why?: string;
  skills: { name: string; confidence_score: number }[];
  relevant_job_id: string;
}
