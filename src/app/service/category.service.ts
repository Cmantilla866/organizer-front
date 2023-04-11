import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import { Category } from '../entity/Category';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/category'

  constructor(private http:HttpClient) { }

  getCategorys(): Observable<Category[]>{
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCurrentTypes(): Observable<string[]>{
    const url = `${this.apiUrl}/types`;
    return this.http.get<string[]>(url);
  }

  deleteCategory(categoryId?: number): Observable<Category>{
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.delete<Category>(url);
  }

  updateCategory(task: Category, categoryId?: number): Observable<Category>{
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.put<Category>(url, task, httpOptions);
  }
  
  addCategory(task: Category): Observable<Category>{
    return this.http.post<Category>(this.apiUrl, task, httpOptions);
  }
}
