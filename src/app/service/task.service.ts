import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import { Task } from '../entity/Task';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/task'

  constructor(private http:HttpClient) { }

  getTasks(): Observable<Task[]>{
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTasksByToDo(toDoId?: number): Observable<Task[]>{
    const url = `${this.apiUrl}/${toDoId}`;
    return this.http.get<Task[]>(url);
  }

  deleteTask(taskId?: number): Observable<Task>{
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.delete<Task>(url);
  }

  updateTask(task: Task, taskId?: number): Observable<Task>{
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.put<Task>(url, task, httpOptions);
  }
  
  addTask(task: Task): Observable<Task>{
    return this.http.post<Task>(this.apiUrl, task, httpOptions);
  }
}
