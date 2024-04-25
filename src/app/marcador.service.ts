import { Injectable } from '@angular/core';
import { Observable, of, timer, from } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatchService } from './services/match.service';
@Injectable({
  providedIn: 'root'
})
export class MarcadoresService {
  private marcadoresSubject = new Subject<any[]>(); // Observable for markers (using 'any' type)
  marcadores$: Observable<any[]> = this.marcadoresSubject.asObservable().pipe(
    // ShareReplay to ensure a single data stream
    shareReplay(1),
    // Simulate data refresh every 2 seconds (replace with your actual data fetching logic)
    tap(() => timer(2000).subscribe(() => this.obtenerMarcadores()))
  );

  constructor(private matchService:MatchService) {}

  obtenerMarcadores() {
    // Implement your logic to fetch markers from MySQL or other data source
    // Update `this.marcadoresSubject` with the fetched markers (using 'any' type)
    const marcadoresEjemplo: any[] = [
      { id: 1, nombre: 'Marcador 1 (actualizado)' },
      { id: 2, nombre: 'Marcador 2' }
    ];
    this.marcadoresSubject.next(marcadoresEjemplo);
  }

  getMarcadorObservable() {
    return from(this.matchService.getMarcador()); // Convert promise to Observable
  }
}
