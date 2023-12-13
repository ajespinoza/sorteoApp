import { Component, OnInit } from '@angular/core';
import { SorteoService } from './sorteo.service';
import { Participantes } from './participantes.interface';
import party from "party-js";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sorteo';
  participantes: Participantes[] = []
  numerosParticipantes: number[] = []
  participantesConPremio: Participantes[] = []
  totalParticipantes: number = 0
  isloading: boolean = false;

  numeroSeleccionado: number = 0;
  participanteSeleccionado: string = "N/A";

  constructor(private sorteoService : SorteoService){

  }

  ngOnInit(): void {
    this.loadParticipantes();
    this.loadParticipantesConPremio();
    this.loadNumeros();
  }


  loadParticipantes(){
    let validationArray : Participantes[] = []
    if(localStorage.getItem('participantes'))
      validationArray = JSON.parse(localStorage.getItem("participantes")!);


    if(!localStorage.getItem('participantes') || validationArray.length == 0){
      this.sorteoService.getJsonData().subscribe(
        (response) => {
          localStorage.setItem('participantes', JSON.stringify(response));
          this.participantes = JSON.parse(localStorage.getItem('participantes')!);
          this.totalParticipantes = this.participantes.length;
          this.numerosParticipantes = this.sorteoService.generarNumeros(this.totalParticipantes);
        }
      );
    }else{
      this.participantes = JSON.parse(localStorage.getItem('participantes')!);
      this.totalParticipantes = this.participantes.length;
      this.numerosParticipantes = this.sorteoService.generarNumeros(this.totalParticipantes);
    }


  }

  loadParticipantesConPremio(){

    this.participantesConPremio = [];
    if(localStorage.getItem('participantesConPremio')){
      this.participantesConPremio = JSON.parse(localStorage.getItem('participantesConPremio')!);
    }
  }

  loadNumeros(){
    this.numerosParticipantes = this.sorteoService.getNumeros();
    if(this.numerosParticipantes.length == 0){
      this.numerosParticipantes = this.sorteoService.generarNumeros(this.totalParticipantes);
    }
  }

  generarNombre(source:any){
    if(this.participantes.length > 0){
      this.isloading = true;
      setTimeout(() => {
        this.numeroSeleccionado =0;
        let position = this.sorteoService.generaRandom(0, this.participantes.length - 1);
        this.participanteSeleccionado = this.participantes[position].nombre;

        let participantesNuevos = this.participantes.filter( x => x.nombre !== this.participanteSeleccionado);
        this.sorteoService.saveParticipantes(participantesNuevos);
        this.participantes = JSON.parse(localStorage.getItem('participantes')!)
        this.isloading = false;
        // this.showconfetti(source);
      }, 2000);
    }

  }

  generarNumero(source:any){
    console.log(this.numerosParticipantes)
    if(this.numerosParticipantes.length > 0){
      this.isloading = true;
      setTimeout(() => {
        let position = this.sorteoService.generaRandom(0, this.numerosParticipantes.length - 1);
        this.numeroSeleccionado = this.numerosParticipantes[position];

        let numerosNuevos = this.numerosParticipantes.filter( x => x !== this.numeroSeleccionado);
        this.sorteoService.saveNumeros(numerosNuevos);
        this.numerosParticipantes = this.sorteoService.getNumeros();
        this.participantesConPremio.push({ nombre: this.participanteSeleccionado, numero: this.numeroSeleccionado })
        this.sorteoService.saveConPremio(this.participantesConPremio);
        this.isloading = false;
        this.showconfetti(source);
      }, 3000);
    }

  }


  reset(){
    this.sorteoService.reset();
    this.loadParticipantes();
    this.loadParticipantesConPremio();
    this.loadNumeros();
    this.participanteSeleccionado = "N/A";
    this.numeroSeleccionado = 0;
  }

  showconfetti(source:any){
    party.confetti(source, { count: party.variation.range(80,220)});
  }

}
