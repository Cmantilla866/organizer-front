import { Category } from "./Category";

export interface ToDo {
    id?: number;
    name: string;
    description: string;
    jumpStart: string;
    priority: number;
    deadline: Date;
    maxTime: number;
    categoryDTO: Category;
  }