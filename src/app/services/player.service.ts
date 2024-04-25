import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    private apiUrl = 'http://localhost:4001'; // Aquí almacenarás la lista de jugadores

    constructor(private http: HttpClient) {}

    getAllPlayers(): Observable<Player[]> {
      return this.http.get<Player[]>(`${this.apiUrl}/api/players`).pipe(
        tap(players => console.log('Respuesta del servidor:', players))
      );
    }
    getPlayerByNumber(playerNumber: number): Observable<Player> {
      // Puedes cambiar la implementación según la estructura de tu backend
      // Este es solo un ejemplo de cómo podrías obtener un jugador por su número
      return this.http.get<Player>(`${this.apiUrl}/api/players/${playerNumber}`);
    }
  
    addPlayer(newPlayer: Player): Observable<Player> {
      return this.http.post<Player>(`${this.apiUrl}/api/players`, newPlayer);
    }
    getAllPositions(): Observable<any> {
      return this.http.get(`${this.apiUrl}/api/positions`);
    }
  
    // Otros métodos CRUD según sea necesario
  }
