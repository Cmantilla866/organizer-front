import { ToDo } from "./ToDo";

export interface Task {
    id?: number;
    name?: string;
    description?: string;
    jumpStart?: string;
    toDoDTO?: ToDo;
  }