export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  tags: string[];
  pageContent: string;
  link?: string;
  sections?: any[];
  blocks?: any[]; // Notion-style blocks for detail page
}

