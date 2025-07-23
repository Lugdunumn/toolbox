import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: Record<string, any> = {};

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>('/assets/config/runtime-config.json')
      .pipe(
        tap(config => this.config = config),
        catchError(() => of({}))
      );
  }

  get(key: string): any {
    return this.config[key];
  }
}