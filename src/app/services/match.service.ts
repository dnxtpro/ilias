import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Match,MatchEvent,MatchDetails } from '../models/match.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { ModalService } from './modal-service.service';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  // Lista de partidos, asegúrate de tener datos aquí
  private matches: Match[] = [];

  // Reemplaza con la URL de tu backend
  private apiUrl = 'http://localhost:4001/';
  

  constructor(private http: HttpClient,private dialog: MatDialog,private modalService: ModalService,private playerService: PlayerService) {}
  getFaultTypes(): Observable<any> {
  return this.http.get<any>('http://localhost:4001/api/fault-types').pipe(
    map((data) => {
      console.log('Datos obtenidos:', data);

      // Filtrar tipos de fallo y aciertos según la propiedad isSuccess
      const successes: any[] = data.filter((item: any) => {
        
        return item.isSuccess === 1;
      });

      const faults: any[] = data.filter((item: any) => {
  
        return item.isSuccess === 0;
      });

    

      return { successes, faults };
    })
  );
}
getMarcador(): Observable<any[]>{
  return this.http.get<any[]>('http://localhost:4001/api/marcador');
}
getMatchDetails(): Observable<MatchDetails[]> {
  return this.http.get<MatchDetails[]>('http://localhost:4001/api/create-match/getMatches');
}
getMatchEventsByMatchId(matchId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}api/matchevents/${matchId}`);
}
  getLatestMatchDetails(): Observable<any> {
    return this.http.get<any>('http://localhost:4001/api/latest-match-details');
  }
  getLatestMatchEvent(): Observable<any> {
    const url = `${this.apiUrl}api/matchevent/getLatest`;
    return this.http.get(url);
  }
  deleteLastMatchEvent(matchId: number): Observable<any> {
    console.log(matchId,'enviado')
    const url = `${this.apiUrl}api/matchevent/delete-last`;

    // Enviar el matchId al backend para borrar el último evento específico
    return this.http.delete(url, { params: { matchId: matchId.toString() } });
  }
  sendMatchEvent(event: MatchEvent): Observable<any> {
    // Lógica para enviar el evento al backend
    return this.http.post<any>(`${this.apiUrl}api/send-match-event`, event);
  }
  ultimoseventos(match1Id:number): Observable<any>{
    console.log(match1Id)
return this.http.get<any>(`${this.apiUrl}api/ultimoseventos/${match1Id}`);
  }
  

  createMatch(matchData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}api/create-match`, matchData);
  } 
  getLatestMatch(): Observable<any> {
    return this.http.get<any>('/api/latest-match');
  }
  
  getMatches(): Observable<Match[]> {
    // Reemplaza la implementación actual con una solicitud GET al backend
    return this.http.get<Match[]>(`${this.apiUrl}api/partido`);
  }

  getMatchById(id: number): Observable<Match> {
    // Reemplaza la implementación actual con una solicitud GET al backend por ID
    return this.http.get<Match>(`${this.apiUrl}/${id}`);
  }
  saveMatchEvent(matchEventData: MatchEvent, eventId: number): Observable<any> {
      const payload = {
      matchEventData,
    };
  
   return this.http.post<any>(`${this.apiUrl}api/match-events`, payload);
  }
  handleMatchEvent(event: Match & MatchEvent) {
    this.sendMatchEvent(event).subscribe(
      (response) => {
        // Manejar la respuesta del backend si es necesario
        // Aquí puedes abrir la ventana modal con los detalles del jugador si la respuesta lo permite
        if (event.playerPoints && event.playerPoints.length > 0) {
          event.playerPoints.forEach((playerPoint) => {
            // Obtener información del jugador
            this.playerService.getPlayerByNumber(playerPoint.playerNumber).subscribe(
              (player) => {
                const playerInfo = {
                  player_id: player.player_id,
                  name: player.name,
                  dorsal: player.dorsal,
                  positionId: player.positionId,
                  position_name: player.position_name,  
                };
                this.modalService.openPlayerModal([playerInfo]);
              },
              (error) => {
                console.error('Error al obtener información del jugador:', error);
              }
            );
          });
        }
      },
      (error) => {
        console.error('Error al enviar el evento al backend:', error);
        // Manejar errores si es necesario
      }
    );
  }
}

  

  // Otros métodos para gestionar la lista de partidos
