import { Component,OnInit } from '@angular/core';
import { MatchService } from '../services/match.service';
import { Router } from '@angular/router';
import { MarcadoresService } from '../marcador.service';
@Component({
  selector: 'app-marcador',
  templateUrl: './marcador.component.html',
  styleUrl: './marcador.component.css'
})
export class MarcadorComponent  implements OnInit{
  marcador:any=[]
constructor( private matchService: MatchService,private router:Router,private marcadoresService: MarcadoresService){}
getMarcador(){
  this.matchService.getMarcador().subscribe((data) => {
    // Asegúrate de que los objetos Player tengan la propiedad positionId
    this.marcador = data;
    console.log(this.marcador)
  });
}
ngOnInit(): void {
    // Subscribe to the marcadores$ observable for continuous updates
    this.marcadoresService.marcadores$.subscribe((marcadores) => {
      // Update the marcador property with the latest data (using 'any' type)
      this.marcador = marcadores.find((m) => m.id === this.marcador.id); // Assuming id is a unique identifier
      console.log(this.marcador);
    });

    // Call getMarcadorObservable and subscribe to its inner observable
    this.marcadoresService.getMarcadorObservable().subscribe((data) => {
      // Ensure Player objects have the positionId property if applicable
      this.marcador = data;
      console.log(this.marcador);

      // Manually trigger marcadoresService update to reflect initial data
      this.marcadoresService.obtenerMarcadores();
    });
  }
}
