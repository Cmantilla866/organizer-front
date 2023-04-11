import { Task } from "./Task";
import { ToDo } from "./ToDo";

export interface TimeSpace {
    id?: number;
    toDoDTO: ToDo;
    taskDTO: Task;
    date: Date;
    time: number;
  }