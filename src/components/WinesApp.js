import  Wine  from './wine.js';

class WineApp {
  // Base de datos
  allWine = [];
  // Base de datos cuando usamos filtros.
  wineFilter = [];

  // Cazamos el botón.
  addBtn = document.querySelector('.add');
  sidebar = document.querySelector('.sidebar');
  addIcon = document.querySelector('.bi-plus-lg');
  form = document.querySelector('.form');
  wineList = document.querySelector('.wine-list');
  filterForm = document.querySelector('.filters-form');

  // Activar o desactivar el Sidebar.
  hasSidebar = false;
  // Estamos editando o no.
  isEditing = false;
  //Pasas id editando. 
  currentId = null; 

  constructor() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e)); 
    this.addBtn.addEventListener('click',(e) => this.addForm (e));
    this.form.cancelForm.addEventListener('click',(e) => this.closeSidebar (e));
    this.wineList.addEventListener ('click', (e) => this.delegateOption(e));

    // Filtros
    this.filterForm.search.addEventListener('keypress', (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        this.handleFilterSubmit(e)
      }
    });
    this.filterForm.search.addEventListener('input', (e) => {
      const value = e.target.value.trim()
      if(!value) this.handleFilterSubmit(e)
      if(value.length > 2)  this.handleFilterSubmit(e)
    });
    this.filterForm.typesWineFilter.addEventListener('change', (e) => this.handleFilterSubmit(e));
    this.filterForm.favoriteFilter.addEventListener('change', (e) => this.handleFilterSubmit(e));
    this.filterForm.tastedFilter.addEventListener('change', (e) => this.handleFilterSubmit(e));
    this.filterForm.notTastedFilter.addEventListener('change', (e) => this.handleFilterSubmit(e));
    
    this.getWinesFromLocalStorage();
  }
  
  // Local Storage.
  getWinesFromLocalStorage = () => {
    const winesParsed = JSON.parse(localStorage.getItem('allWine'));
    
    if(!winesParsed) {
      this.allWine = [];
      return;
    }

    this.allWine = winesParsed.map( (wine) => {
      const newWine = new Wine(wine);
      return newWine;
    });

    this.printWines();
  }
  
  // Actualizar el localStorage.
  updateWineLocalStorage = () => {
  const allWineString = JSON.stringify(this.allWine);
  localStorage.setItem('allWine', allWineString);
  }

  // Cerrar el Sidebar.
  closeSidebar = () => {
    this.sidebar.className = 'sidebar sidebar-left'
    this.hasSidebar = false;  
    this.addIcon.classList.replace('bi-x-lg','bi-plus-lg') 
    this.isEditing = false;
    this.form.reset();
  }

  // Sidebar.
  addForm() {
    if(this.hasSidebar === false) {
      this.editWine({});
      this.hasSidebar = true;
      this.addIcon.classList.replace('bi-plus-lg','bi-x-lg')
    } else {
      this.closeSidebar();     
    }
  } 

  // Escuchar y elegir al icono del article.
  delegateOption(e) {
    const wineId = e.target.parentElement.dataset.id;
    const wine = this.allWine.find((wine) => wine.id === wineId);
    if(e.target.id === 'tastedIcon'){
      this.changeTasted(wine);
    } else if (e.target.id === 'trashIcon'){
      this.deleteWine (wineId);
    }else if (e.target.id === 'editIcon'){
      this.editWine (wine, true);
    }else if (e.target.id === 'favoriteIcon'){
      this.changeFavorite(wine)
    } 
  }  

  // Valores.
  getValues() {
    const nameOfWineValue = this.form.nameOfWine.value;
    const wineCellarValue = this.form.wineCellar.value;
    const elaborationAreaValue = this.form.elaborationArea.value;
    const denominationOfOriginValue = this.form.denominationOfOrigin.value;
    const typeOfWineValue = this.form.typeOfWine.value;
    const photoValue = this.form.photo.value;
    const tastedValue = this.form.tasted.checked;
    if(!nameOfWineValue){
      this.form.nameOfWine.classList.add('input-error');
      return;
    } 
    this.form.nameOfWine.classList.remove('input-error');
    
    if(!wineCellarValue){
      this.form.wineCellar.classList.add('input-error');
      return;
    } 
    this.form.wineCellar.classList.remove('input-error');

    if(!elaborationAreaValue){
      this.form.elaborationArea.classList.add('input-error');
      return;
    } 
    this.form.elaborationArea.classList.remove('input-error');

    if(!denominationOfOriginValue){
      this.form.denominationOfOrigin.classList.add('input-error');
      return;
    }
    this.form.denominationOfOrigin.classList.remove('input-error');
    if(!photoValue){
      this.form.photo.classList.add('input-error');
      return;
    } 
    this.form.photo.classList.remove('input-error');

  return [nameOfWineValue, wineCellarValue, elaborationAreaValue, denominationOfOriginValue, typeOfWineValue, photoValue, tastedValue];
  } 

  // Añadimos un vino.
  addWine(values) {
    const [nameOfWine, wineCellar, elaborationArea, denominationOfOrigin, typeOfWine, photo, tasted] = values;

    const wine = {
      nameOfWine: nameOfWine,
      wineCellar: wineCellar,
      elaborationArea: elaborationArea,
      denominationOfOrigin: denominationOfOrigin,
      typeOfWine: typeOfWine,
      photo: photo,
      tasted: tasted
    } 

    const newWine = new Wine (wine)
    
    this.allWine = [...this.allWine, newWine];
    
    this.updateWineLocalStorage();
    this.getWinesFromLocalStorage();

    // resetear formulario
    this.form.reset();
  }

  // Borrar.
  deleteWine(wineId) {
    this.allWine = this.allWine.filter ((wine) => wineId !== wine.id );
    this.updateWineLocalStorage();
    this.getWinesFromLocalStorage();
  }

  // Editar.
  editWine(wine, editing = false) {
    // Sacamos el formulario
    this.sidebar.className = 'sidebar sidebar-right';
    //  Cogemos las cajas
    this.form.nameOfWine.value= wine.nameOfWine || '';
    this.form.wineCellar.value= wine.wineCellar || '';
    this.form.elaborationArea.value= wine.elaborationArea || '';
    this.form.denominationOfOrigin.value= wine.denominationOfOrigin || '';
    this.form.typeOfWine.value= wine.typeOfWine || 'Tipo de vino';
    this.form.photo.value= wine.photo || '';
    this.form.tasted.checked= wine.tasted || false;
    // Cambiamos las propiedades globales
    this.currentId = wine.id;
    this.isEditing = editing;
    
  }

  updateWine() {
    const values = this.getValues();
    if(!values) return;

    const [nameOfWine, wineCellar, elaborationArea, denominationOfOrigin, typeOfWine, photo, tasted] = values;
    
    const currentWine = this.allWine.find((wine) => wine.id === this.currentId);
    currentWine.updateData(nameOfWine, wineCellar, elaborationArea, denominationOfOrigin, typeOfWine, photo, tasted);
    
    this.updateWineLocalStorage();
    this.getWinesFromLocalStorage();

    this.currentId = null;
  }

  // Catado.
  changeTasted(wine) {
    wine.tasted = !wine.tasted;
    this.updateWineLocalStorage();
    this.getWinesFromLocalStorage();
  }

  // Favoritos.
  changeFavorite(wine) {
    wine.favorite = !wine.favorite;  
    this.updateWineLocalStorage();
    this.getWinesFromLocalStorage();
  }

  // Imprimir vinos en pantalla.
  printWines(array = this.allWine) {
    this.wineList.innerHTML = '';
    array.forEach( (wine) => {
      this.wineList.append(wine.article);
    })
  }

  // Se ejecuta cuando nos añadan o modifiquen un vino.
  handleSubmit(e) {
    e.preventDefault();

    const values = this.getValues();
    if(!values) return;

    if(this.isEditing === false) {
      this.addWine(values); 
    }else {
      this.updateWine(values);
    } 
    this.closeSidebar()
  }
  
  // Filtro Buscar.
  searchFilter (){
    const value = this.filterForm.search.value.trim().toLowerCase()

    if (value) {
      this.wineFilter = this.wineFilter.filter((wine) => {
        return wine.nameOfWine.toLowerCase().includes(value) || 
          wine.denominationOfOrigin.toLowerCase().includes(value) || 
          wine.wineCellar.toLowerCase().includes(value) || 
          wine.elaborationArea.toLowerCase().includes(value)
      })
    }
  }
  
  // Filtrar por tipos de vinos.
  typesWineFilter(){
    const typesWineFilterValue = this.filterForm.typesWineFilter.value;

    if (typesWineFilterValue !== 'Tipo de vino'){
      this.wineFilter = this.wineFilter.filter((wine) => wine.typeOfWine === typesWineFilterValue);
    }
  }

  // Filtrar por catados.
  tastedFilter() {
    if(this.filterForm.tastedFilter.checked){
      this.wineFilter = this.wineFilter.filter( (wine) => wine.tasted);
    }
  }

  // Filtrar por no catados.
  notTastedFilter() {
    if(this.filterForm.notTastedFilter.checked){
      // Filtrar por no catados
      this.wineFilter = this.wineFilter.filter( (wine) => !wine.tasted);
    }
  }

  // Filtrat por favoritos.
  favoriteFilter() {
    if (this.filterForm.favoriteFilter.checked) {
      this.wineFilter = this.wineFilter.filter((wine) => wine.favorite);
    }
  }

  /* Filtros */
  handleFilterSubmit(e){
    this.wineFilter = [].concat(this.allWine)
    this.searchFilter();
    this.typesWineFilter();
    this.favoriteFilter();
    this.notTastedFilter();
    this.tastedFilter();
    

    this.printWines(this.wineFilter);
  } 
}

export default WineApp;