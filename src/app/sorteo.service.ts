import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Participantes } from './participantes.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SorteoService {
  private jsonUrl = 'assets/participantes.json';

  constructor( private http: HttpClient) {

  }


  getJsonData() : Observable<Participantes[]>{
    return this.http.get<Participantes[]>(this.jsonUrl);
  }

  getParticipantes(){
    let participantes : Participantes[] = []

    this.getJsonData().subscribe(
      (data) => {
        if(!localStorage.getItem('participantes')){
          localStorage.setItem('participantes', JSON.stringify(data));
          participantes = JSON.parse(localStorage.getItem('participantes')!);
        }else{
          let part : Participantes[] = JSON.parse(localStorage.getItem('participantes')!);
          if(part.length > 0)
            participantes = JSON.parse(localStorage.getItem('participantes')!);
          else{
            participantes = data;
            localStorage.setItem('participantes', JSON.stringify(data));
          }
        }
      }
    );
    return of(participantes);
  }

  saveParticipantes(participantes : Participantes[]){
    localStorage.setItem('participantes', JSON.stringify(participantes));
  }





  getParticipantesConPremio(){
    let participantes: Participantes[] = [];

    if(localStorage.getItem('participantesConPremio')){
      participantes = JSON.parse(localStorage.getItem('participantesConPremio')!);
    }

    return participantes;
  }

  saveConPremio(participantes: Participantes[]){
    localStorage.setItem('participantesConPremio', JSON.stringify(participantes));
  }

  saveParticipanteConPremio(participante: Participantes){
    let participantes: Participantes[] = this.getParticipantesConPremio();
    participantes.push(participante);
    this.saveConPremio(participantes);
  }




  generarNumeros(total: number ){
    let array : number[] = []
    for(let i=1; i<= total; i++){
      array.push(i);
    }
    if(!localStorage.getItem("numeros")){
      localStorage.setItem("numeros", JSON.stringify(array));
    }
    return array;
  }

  getNumeros(){
    let numeros: number[] = []
    numeros = JSON.parse(localStorage.getItem("numeros")!);
    return numeros;
  }

  saveNumeros(array: number[]){
    localStorage.setItem("numeros", JSON.stringify(array));
  }





  generaRandom(minimo: number, maximo: number) {
    return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
  }

  reset(){
    localStorage.removeItem("numeros");
    localStorage.removeItem("participantesConPremio");
    localStorage.removeItem("participantes");
  }
}
