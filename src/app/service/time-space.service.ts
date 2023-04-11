import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import { TimeSpace } from '../entity/TimeSpace';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
@Injectable({
  providedIn: 'root'
})
export class TimeSpaceService {

  private apiUrl = 'http://localhost:8080/timeSpace'

  constructor(private http:HttpClient) { }

  getTimeSpaces(): Observable<TimeSpace[]>{
    return this.http.get<TimeSpace[]>(this.apiUrl);
  }

  getTimeSpacesByToDo(toDoId?: number): Observable<TimeSpace[]>{
    const url = `${this.apiUrl}/toDo/${toDoId}`;
    return this.http.get<TimeSpace[]>(url);
  }

  getTimeSpacesByDate(date?: string): Observable<TimeSpace[]>{
    const url = `${this.apiUrl}/date/${date}`;
    return this.http.get<TimeSpace[]>(url);
  }

  getTimeByDate(date?: string): Observable<string>{
    const url = `${this.apiUrl}/${date}`;
    return this.http.get<string>(url);
  }

  getTimeSpacesByTask(taskId?: number): Observable<TimeSpace[]>{
    const url = `${this.apiUrl}/task/${taskId}`;
    return this.http.get<TimeSpace[]>(url);
  }

  getLastTimeSpace(): Observable<TimeSpace>{
    return this.http.get<TimeSpace>(this.apiUrl + "/last");
  }

  deleteTimeSpace(timeSpaceId?: number): Observable<TimeSpace>{
    const url = `${this.apiUrl}/${timeSpaceId}`;
    return this.http.delete<TimeSpace>(url);
  }

  updateTimeSpace(task: TimeSpace, timeSpaceId?: number): Observable<TimeSpace>{
    const url = `${this.apiUrl}/${timeSpaceId}`;
    return this.http.put<TimeSpace>(url, task, httpOptions);
  }
  
  addTimeSpace(task: TimeSpace): Observable<TimeSpace>{
    console.log(task);
    return this.http.post<TimeSpace>(this.apiUrl, task, httpOptions);
  }
}
