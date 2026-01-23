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
  role: 'recruiter' | 'admin';
  photo_url?: string;
  onboarding: boolean;
  company_id?: string;
  companies?: Company[];
  intent_text?: string;
  oauth_accounts?: { provider: string; provider_user_id: string }[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void; // TODO: Add logout function
  refreshUser: () => Promise<void>;
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

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  source: 'github' | 'linkedin' | 'manual';
  confidence_score: number;
}

export interface Candidate {
  candidate_id: string; // The UUID (kept internal, but UI will use hash)
  intent_text: string;
  why?: string;
  skills: Skill[];
  relevant_job_id: string;
  last_verified_at?: string;
  // Revealed fields after match
  name?: string;
  github_url?: string;
  linkedin_url?: string;
  photo_url?: string;
  is_revealed?: boolean;
}

export interface SwipeResponse {
  success: boolean;
  match?: Match;
  is_mutual: boolean;
}

export interface Match {
  id: string;
  candidate?: Candidate;
  explainability_json?: { score: number; reason: string };
  job?: { id: string; problem_statement: string; skills_required: string[] };
  messages?: { content: string; sender_id: string; created_at: string }[];
  created_at: string;
}
