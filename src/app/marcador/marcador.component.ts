import { Component, OnInit, OnDestroy,AfterViewInit } from '@angular/core';
import { MatchService } from '../services/match.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-marcador',
  templateUrl: './marcador.component.html',
  styleUrl: './marcador.component.css'
})
export class MarcadorComponent implements AfterViewInit,OnInit {
  marcador: any = [];
  private intervalo: any;
  constructor(private matchService: MatchService, private router: Router) {
    this.getMarcador();
  }
  ngOnInit(): void {
  this.getMarcador();
}
ngAfterViewInit(): void {
  this.intervalo = setInterval(() => {
    this.getMarcador();
  }, 5000);
  console.log('sale del bucle')

}

  getMarcador(){
    console.log('getmarcador')
  this.matchService.getMarcador().subscribe((data) => {
    this.marcador = data;
    console.log(this.marcador)
  })
}
  ngOnDestroy() {
    clearInterval(this.intervalo);
  }
}
