import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'gifs-search-box',
  template: `
    <h5>Buscar:</h5>
    <input type="text"
    class="form-control"
    placeholder="Buscar gifs.."
    (keyup.enter)="searchTag()"
    #txtTagInput
    >
  `

})

export class SearchBoxComponent {

  @ViewChild('txtTagInput')
  public tagInput!: ElementRef<HTMLInputElement>;

  constructor( private gifsService: GifsService ) { }

  searchTag(){
    const newTag = this.tagInput.nativeElement.value;
    //console.log({ newTag});
    this.gifsService.searchTag(newTag);

    this.tagInput.nativeElement.value = '';
  }
}

/*el keydown, keypress o keydown nos solicita peticiones http en tiempo real cada vez que interactuamos con las teclas
pero angular nos trae una caracterirtica importante el .enter, no hara peticiones con cada interacción sino hasta el final
cuando precionemos enter*/
