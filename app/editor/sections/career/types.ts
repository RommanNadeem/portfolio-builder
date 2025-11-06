export interface CareerHighlight {
  id: string;
  organization: string;
  role: string;
  description: string;
  link: string;
  achievements: string[];
  startDate: string;
  endDate: string;
  current: boolean;
  isPageBlock?: boolean;
  pageContent?: string;
  sections?: any[];
}

