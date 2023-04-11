import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'
import {Observable} from 'rxjs'
import { ToDo } from '../entity/ToDo';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  private apiUrl = 'http://localhost:8080/toDo'

  constructor(private http:HttpClient) { }

  getToDos(): Observable<ToDo[]>{
    return this.http.get<ToDo[]>(this.apiUrl);
  }

  getRandomToDo(categoryIds: number[], include: boolean, important: boolean): Observable<ToDo>{
    let ids:string = "";
    if (categoryIds){
      ids = categoryIds.join(",");
    }
    let queryParams = new HttpParams().append("categoryIds", ids).append("include", include).append("important", important);
    return this.http.get<ToDo>(this.apiUrl+"/random", {params : queryParams}); 
  }

  getImportantToDos(): Observable<ToDo[]>{
    return this.http.get<ToDo[]>(this.apiUrl+"/important");
  }

  getToDosByCategory(categoryId?: number): Observable<ToDo[]>{
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.get<ToDo[]>(url);
  }

  deleteToDo(toDoId?: number): Observable<ToDo>{
    const url = `${this.apiUrl}/${toDoId}`;
    return this.http.delete<ToDo>(url);
  }

  updateToDo(task: ToDo, toDoId?: number): Observable<ToDo>{
    const url = `${this.apiUrl}/${toDoId}`;
    return this.http.put<ToDo>(url, task, httpOptions);
  }
  
  addToDo(task: ToDo): Observable<ToDo>{
    return this.http.post<ToDo>(this.apiUrl, task, httpOptions);
  }
}
