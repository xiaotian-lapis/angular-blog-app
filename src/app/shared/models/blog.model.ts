/**
 * Blog model
 */
export interface IBlog {
  id: string;
  author: string;
  title: string;
  description: string;
  content: string;
  createdTime: Date;
  updatedTime: Date;
}
