// src/app/services/fault-type.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaultTypeService {
  private baseUrl = 'http://localhost:4001/'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  getFaultTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}api/fault-types`);
  }
}
