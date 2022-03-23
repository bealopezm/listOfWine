import { nanoid } from '../../node_modules/nanoid/nanoid.js';

class Wine {
  constructor(wine) {

    this.nameOfWine = wine.nameOfWine;
    this.wineCellar = wine.wineCellar;
    this.elaborationArea = wine.elaborationArea;
    this.denominationOfOrigin = wine.denominationOfOrigin;
    this.typeOfWine = wine.typeOfWine;
    this.photo = wine.photo || '';
    this.tasted = wine.tasted || false;
    this.id = wine.id || nanoid();
    this.favorite = wine.favorite || false;

    this.article = document.createElement('article');

    this.createMarkup();
  }

  //Creamos el article tal y como lo veremos en pantalla. 
  createMarkup() {
    const photo = this.photoValue();
    this.article.className = 'col-5 border border-primary m-3 p-2 rounded row align-items-center';
    this.article.dataset.id = this.id;
    this.article.innerHTML = `
    <div class="col-4">
    ${photo}
    </div>
    <div class="col-8 col-md-6 col-lg-7">
      <h5>${this.nameOfWine}</h5>
      <h5>${this.typeOfWine}</h5>
      <h5>Bodega ${this.wineCellar}</h5>
      <h6>Zona: ${this.elaborationArea}</h6>
      <h6 class="mb-0">${this.denominationOfOrigin}</h6>
    </div>
    <div data-id="${this.id}" class="col-4">
    <i id="favoriteIcon" class="icon favorite bi ${this.favorite ? 'bi-heart-fill' : 'bi-heart'} text-warning fs-4"></i>
    </div>
    <div data-id="${this.id}" class="icons col-8">
      <h5 class="d-inline">¿Catado?</h5>
      <i id="tastedIcon"  class="icon bi ${this.tasted ? 'bi-check-lg' : 'bi-x'} fs-3 me-3"></i>
      <i id="editIcon" class="line-end icon bi bi-pencil-fill text-info fs-4 text-center "></i>
      <i id="trashIcon" class="line-end icon bi text-success bi-trash-fill fs-4 ms-1"></i></div>`;
  }

  // Añadimos la foto al article mediante una función. 
  photoValue(){
    if(this.photo){
      return `<img class="img-thumbnail mx-auto d-block" src="${this.photo}" alt="Foto de vino"/>`;
    }else {
      return '';
    }
  }

  // Actualizamos los datos cuando editamos.
  updateData(nameOfWine, wineCellar, elaborationArea, denominationOfOrigin, typeOfWine, photo, tasted) {
    this.nameOfWine = nameOfWine;
    this.wineCellar = wineCellar;
    this.elaborationArea = elaborationArea;
    this.denominationOfOrigin = denominationOfOrigin;
    this.typeOfWine = typeOfWine;
    this.photo = photo || '';
    this.tasted = tasted || false;
  }
}
export default Wine;  