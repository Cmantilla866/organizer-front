import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import { SatisfactionLevel } from '../entity/SatisfactionLevel';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
@Injectable({
  providedIn: 'root'
})
export class SatisfactionLevelService {
  private apiUrl = 'http://localhost:8080/satisfactionLevel'

  constructor(private http:HttpClient) { }

  getSatisfactionLevelByDate(date?: string): Observable<SatisfactionLevel>{
    const url = `${this.apiUrl}/${date}`;
    return this.http.get<SatisfactionLevel>(url);
  }

  addSatisfactionLevel(satisfactionLevel: SatisfactionLevel): Observable<SatisfactionLevel>{
    return this.http.post<SatisfactionLevel>(this.apiUrl, satisfactionLevel, httpOptions);
  }
}
