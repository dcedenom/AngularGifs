import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchResponse, Gif } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey:       string = 'h5W5Z6ZwzKXt5r6P9AbRPPRi8ucpAX4V';
  private serviceUrl:   string ='https://api.giphy.com/v1/gifs'

  //importamos en el constructor la petición http habilitada desde el app.module.ts
  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string){
    tag = tag.toLowerCase();
    if(this._tagsHistory.includes(tag)){ //tenemos un arrreglo con todos los tags menos con las coincidencias, esto hara que no se repitan los tags
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag)
    }
    this._tagsHistory.unshift( tag ); //insertamos el nuevo tag al inicio de mas viejo a más nuevo y pondra el valor repetido al inicio desapareciendo el más viejo

    this._tagsHistory = this.tagsHistory.splice(0,15); //limita la busqueda al número que pongamos
    this.saveLocalStorage();
  }

  //para que la data sea persistente
  private saveLocalStorage():void {
      localStorage.setItem('history', JSON.stringify(this._tagsHistory)); //EN EL LOCAL STORAGE SOLO PODEMOS ALMACENAR STRINGS
  }

  //para llamar al history de localstorage
  private loadLocalStorage():void {
    if( !localStorage.getItem('history') ) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')! );

    if( this._tagsHistory.length === 0) return;
    this.searchTag( this._tagsHistory[0]);
  }

   //este si lo vamos ausar con fetch ↓
   //async searchTag( tag: string): Promise<void> {
    searchTag( tag: string): void {
    if(tag.length === 0) return;
    this.organizeHistory(tag);
    //console.log(this.tagsHistory);
    //fetch('https://api.giphy.com/v1/gifs/search?api_key=h5W5Z6ZwzKXt5r6P9AbRPPRi8ucpAX4V&q=valorant&limit=20')
    //.then( resp => resp.json())
    //.then( data=> console.log(data) ); //esta es una forma de hacer peticiones http con fetch

    //otra forma de hacerlo, pero limita el uso con angular
    //const resp = await fetch ('https://api.giphy.com/v1/gifs/search?api_key=h5W5Z6ZwzKXt5r6P9AbRPPRi8ucpAX4V&q=valorant&limit=20')
    //const data = await resp.json();
    //console.log(data);

    //para poder hacer un uso completo de las peticiones http, lo vamos a importar en app.module.ts

    //this.http.get('https://api.giphy.com/v1/gifs/search?api_key=h5W5Z6ZwzKXt5r6P9AbRPPRi8ucpAX4V&q=valorant&limit=20')  //al poner punto no veremos el then xq es un observable no una promesa -> ver hoja de atajos de angular




    //mejorando la url
    //creamos una constante con params que ya viene por defecto en angular y no hay que importar, eliminamos todo el query de la url y madamos el segundo valor que sería params
    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '20')
    .set('q', tag)

    this.http.get<SearchResponse>(` ${ this.serviceUrl }/search`, { params })
    .subscribe ( resp=> {
      //console.log( resp.data ); //typescrip no sabe como luce la data, debemos crear una interfaz compleja, sin embargo es muy dificil manualmente, por lo que podemos acudir a servicios preparados para este fin
      //ahora podemos llamar la data, se importo public gifList
      this.gifList = resp.data;
      //console.log({ gifs:this.gifList });
      //Mostrar Gifs en pantalla
      //para esto debemos inyectarlo en home-page.component.ts
    })

  }
}
