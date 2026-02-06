export interface Post {
  id: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  overview: string;
  body: string;
  conclusion: string;
  references: Reference[];
  readTime: number;
  series?: string;
}

export interface Reference {
  title: string;
  url: string;
}

export interface Comment {
  id: string;
  author: string;
  date: string;
  content: string;
  replies?: Comment[];
}
