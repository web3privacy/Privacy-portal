export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string | null;
  description: string;
  url: string;
  category: string;
  tags: string[];
  explorerProjectId?: string | null;
  createdAt: string;
}

export interface JobsData {
  categories: string[];
  jobs: Job[];
}
