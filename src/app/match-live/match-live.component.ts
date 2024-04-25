import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../services/match.service';
import { FaultTypeService } from '../services/fault-type.service';
import { PlayerService } from '../services/player.service';
import { MatDialog } from '@angular/material/dialog';
import { PlayerModalComponent } from '../player-list-modal/player-list-modal.component';
import { Player } from '../models/player.model';
import { Observable } from 'rxjs';
import { ChoosePlayersComponent } from '../choose-players/choose-players.component';

interface Eventos{
  
  tipofallo:string;
  player_name?: string;
  dorsal:number;
  puntosLocal:number;
  puntosVisitante:number;

}
interface TeamScore {
  points: number;
  sets: number;
}

interface MatchScore {
  homeTeam: TeamScore;
  awayTeam: TeamScore;
  events: MatchEvent[];
}

interface MatchEvent {
  id:number;
  eventId:number;
  faultType: string;
  matchId: number;
  playerId: number;
  scoreLocal: number;
  scoreVisitor: number;
  setsLocal: number;
  setsVisitor: number;
  timestamp: string;
  actionType: string;
}




@Component({
  selector: 'app-match-live',
  templateUrl: './match-live.component.html',
  styleUrls: ['./match-live.component.css']
})
export class MatchLiveComponent implements OnInit {
  player_name:string|undefined;
  Eventos:any[]=[];
  latestMatchLocalscore=0;
  latestMatchLocalSets=0;
  latestMatchVisitorscore=0;
  latestMatchVisitorSets=0;
  match1Id=0;

  latestMatchId=0;
  latestMatchRival: string | undefined;
  latestMatchDate: Date | undefined;
  latestMatchLocation: string | undefined;
  selectedFaultType: string = '';
  matchScore: MatchScore = {
    homeTeam: { points: this.latestMatchLocalscore, sets: this.latestMatchLocalSets },   
    awayTeam: { points: this.latestMatchVisitorscore, sets:this. latestMatchVisitorSets},
    events: [],
  };
  falloType: string = '';
  aciertoType: string = '';
  isPlayerListModalOpen = false;
  currentPlayers: Player[] = [];
  aciertos: any[] = [];
  fallos: any[] = [];
  constructor(
    private route: ActivatedRoute,
  private matchService: MatchService,
  private playerService: PlayerService,
  private faultTypeService: FaultTypeService,
  private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.handleMatchEvent;
    this.loadLatestMatchDetails();
    this.ultimoseventosss();
    this.checkSetWinner();
    this.resetScores();
    this.ultimoseventosss();
    

    
  }
  

    
  
  loadLatestMatchDetails() {
    this.matchService.getLatestMatchDetails().subscribe(
      (latestMatchDetails) => {
        console.log('Detalles del partido más reciente:', latestMatchDetails);
        // Aquí puedes asignar los detalles a las propiedades de tu componente
        this.latestMatchRival = latestMatchDetails.rivalTeam;
      this.latestMatchDate = latestMatchDetails.date;
      this.latestMatchLocation = latestMatchDetails.location;
      this.latestMatchId=latestMatchDetails.id;
      },
      (error) => {
        console.error('Error al obtener los detalles del partido más reciente:', error);
        // Manejar errores si es necesario
      }
    );
    this.matchService.getLatestMatchEvent().subscribe(
      (latestMatchEvent) => {
        console.log('Latest match event:', latestMatchEvent);
        this.matchScore.homeTeam.points= latestMatchEvent.scoreLocal;
        this.matchScore.homeTeam.sets= latestMatchEvent.setsLocal;
        this.matchScore.awayTeam.points= latestMatchEvent.scoreVisitor;
        this.matchScore.awayTeam.sets= latestMatchEvent.setsVisitor; 
        this.match1Id=latestMatchEvent.matchId;

      },
      (error) => {
        console.error('Error getting latest match event:', error);
        // Handle errors
      }
    );
    this.playerService.getAllPlayers().subscribe((players) => {
      console.log('Jugadores obtenidos:', players);
      this.currentPlayers = players;
      console.log('Jugadores obtenidos:', players);
    });

    // Cargar tipos de fallos y aciertos
    this.matchService.getFaultTypes().subscribe(
      (data) => {
        console.log('Tipos de fallo antes de mapear:', data);
        this.aciertos = data.successes;
        this.fallos = data.faults;
        console.log('Tipos de fallo:', this.aciertos,this.fallos);
        // Puedes asignar los resultados a una variable y mostrarlos en tu interfaz de usuario
      },
      (error) => {
        console.error('Error al obtener tipos de fallo:', error);
      }
    );
  }
  
  handleFallo(falloType: string): void {
    this.selectedFaultType = falloType;
    console.log('Fallo Type:', falloType);
    this.openPlayerModal('fallo',falloType);
  }
  
  handleAcierto(aciertoType: string): void {
    this.selectedFaultType = aciertoType;
    console.log('Acierto Type:', aciertoType);   
    this.openPlayerModal('acierto', aciertoType);
  }
  
  
  handleMatchEvent(actionType: string, player: Player, faultType: string,action:string) {
    const playerId = player.player_id;
    
    console.log('Nombre de la acción handle:', actionType)
    console.log('Detalles :', actionType,playerId,faultType);
    console.log('ID del jugador seleccionado:', playerId);
    console.log('Aciertos:', this.aciertos);
    console.log('Fallos:', this.fallos);
    if (faultType === undefined) {
      console.error('No se encontró el tipo de fallo/aciertos.');
      return;
    }
    
    const eventId = this.getEventTypeID(faultType,actionType); // Llama a la función para obtener el ID
    console.log('ID del EventType:', eventId);
    
    const timestamp: string = new Date().toISOString().slice(0, 19).replace('T', ' ');

  

    if (actionType=='acierto') {
      this.matchScore.homeTeam.points += 1;  // Sumar puntos al equipo local
    } else if (actionType=='fallo') {
      this.matchScore.awayTeam.points += 1;  // Sumar puntos al equipo visitante
    }
  
    if (this.checkSetWinner()) {
      if (this.matchScore.homeTeam.points > this.matchScore.awayTeam.points) {
        setTimeout(() => {
        this.matchScore.homeTeam.sets += 1;
        this.matchScore.homeTeam.points = 0;
        this.matchScore.awayTeam.points = 0;
        },100);
      } else {
        setTimeout(() => {
        this.matchScore.awayTeam.sets += 1;
        this.matchScore.homeTeam.points = 0;
        this.matchScore.awayTeam.points = 0;
      },100);
      }
      
    
      // Reiniciar los puntos después de ganar un set
    
    }
    const matchId:number=this.latestMatchId;

    const matchEventData: MatchEvent = {
      id:0,
      eventId:eventId!,
      matchId: matchId,
      faultType: faultType,
      actionType: actionType,
      playerId: playerId,
      scoreLocal: this.matchScore.homeTeam.points,
      scoreVisitor: this.matchScore.awayTeam.points,
      setsLocal: this.matchScore.homeTeam.sets,
      setsVisitor: this.matchScore.awayTeam.sets,
      timestamp: timestamp,
    };
    


   this.matchScore.events.push(matchEventData);

    
    console.log('envio al servidor:',eventId)
    if (eventId !== undefined) {
    this.matchService.saveMatchEvent(matchEventData, eventId).subscribe(
      
    (response) => {
      console.log('Evento del partido guardado con éxito', response);
    },
    (error) => {
      // Resto del código...
      console.error('Error al guardar el evento del partido:', error);
    }
    
  );
    } else {
      console.error('Unable to save match event. eventId is undefined.');
  }
  }

  checkSetWinner(): boolean {
    const homePoints = this.matchScore.homeTeam.points;
    const awayPoints = this.matchScore.awayTeam.points;
    const homeSets=this.matchScore.homeTeam.sets;
    const awaySets=this.matchScore.homeTeam.sets;
    if (homePoints >= 25 || awayPoints >= 25) {
      // Verificar la diferencia de puntos
      const pointDifference = Math.abs(homePoints - awayPoints);
  
      // Verificar si la diferencia es al menos 2 puntos
      if (pointDifference >= 2) {
        // Se ha ganado un set
        return true;
      }
    }
    return false;
  }
  checkGameWinner():boolean{
    const homeSets=this.matchScore.homeTeam.sets;
    const awaySets=this.matchScore.homeTeam.sets;
    if(homeSets>=3||awaySets>=3){
      return true;
    }
    return false;
  }

  getEventTypeID(faultType: string,actionType:string): number | undefined {
    // Busca el ID del eventType en tu arreglo de aciertos y fallos\
    console.log('id de fallos',this.aciertos,this.fallos,faultType)

    const aciertoso = this.aciertos.find(aciertoso => aciertoso.type === faultType && actionType === 'acierto');

    if (aciertoso) {
      console.log('id acierto',aciertoso.id)
      return aciertoso.id;
      
    } else {
      
      const falloso = this.fallos.find(falloso => falloso.type === faultType && actionType === 'fallo');

    if (falloso) {
      console.log('id fallo',falloso.id)
      return falloso.id;
      
    } else {
      console.error('No se encontró el ID del EventType para:', faultType);
      return undefined;
    }

    }
    
  }
  openPlayerChooseModal(): void {
    const dialogRef = this.dialog.open(ChoosePlayersComponent, {
      backdropClass: 'backdropBackground',
      width: '80%',
      height:'auto',
      data: {
        players: this.currentPlayers,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          const { player, data } = result; // Access the combined data
          const playerName = player.playerName;
          const playerId =player.player_id;
          const actionType=data.position;
         
      }
  });
}
  

  openPlayerModal(actionType: string, faultType: string): void {
    const dialogRef = this.dialog.open(PlayerModalComponent, {
      backdropClass: 'backdropBackground',
      width: '80%',
      height:'auto',
      data: {
        players: this.currentPlayers,
        modalTitle: 'QUE PUTERO HA SIDO?',
        actionType: actionType,
        faultType: faultType,  // Pasar el tipo de fallo
      }
    });
    
  
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          const { player, data } = result; // Access the combined data
          const playerName = player.playerName;
          const playerId =player.player_id;
          const actionType=data.actionType;
          const faultType=data.faultType; 
          this.handleMatchEvent(actionType,player, faultType,playerName)
          console.log('modnongo',playerId,faultType,actionType)
          this.ultimoseventosss()
          // Process the data as needed
      }
  });
}
getLatestMatchEvent(): Observable<any> {
  return this.matchService.getLatestMatchEvent();
}
deleteLastMatchEvent() {
  
    this.matchService.deleteLastMatchEvent(this.match1Id).subscribe(
      (response) => {
        console.log('Evento eliminado con éxito:', response);
        // Manejar la respuesta del backend si es necesario
      },
      (error) => {
        console.error('Error al eliminar el evento:', error);
        // Manejar errores si es necesario
      },
      ()=>{
        this.loadLatestMatchDetails();
        this.resetScores();
        this.ultimoseventosss()
      }
    );
  }
  ultimoseventosss() {
    this.matchService.ultimoseventos(this.latestMatchId).subscribe(
      (Eventos) => {
        if (Eventos && Eventos.length > 0) {
          this.Eventos = Eventos;
        } else {
          console.log('No hay eventos recientes.');
        }
      }
    );
  }
resetScores(): void {
  if(this.match1Id!=this.latestMatchId){
  this.matchScore.homeTeam.points = 0;
  this.matchScore.homeTeam.sets = 0;
  this.matchScore.awayTeam.points = 0;
  this.matchScore.awayTeam.sets = 0;
  }
  else{console.log('si coinicden')}

  // Optionally reset other properties as needed, such as events array:
  this.matchScore.events = [];
}
}
