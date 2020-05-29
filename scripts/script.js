//Menu
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = 'f94bc554542185998f24f962baf57f7d';
const server = 'https://api.themoviedb.org/3';
const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    tvShows = document.querySelector('.tv-shows'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    searchForm = document.querySelector('.search__form'),
    searchForminput = document.querySelector('.search__form-input'),
    preloader = document.querySelector('.preloader'),
    dropDown = document.querySelectorAll('.dropdown'),
    tvShowsHead = document.querySelector('.tv-shows__head'),
    posterWrapper = document.querySelector('.poster__wrapper'),
    modalContent = document.querySelector('.modal__content'),
    paginations = document.querySelector('.paginations');
  
    

const loading = document.createElement('div');
loading.classList.add('loading');

//получаем данные с json и встраиваем в сайт
class DBService{
    getData = async (url)=>{
        const res = await fetch(url);
        if(res.ok){
            
            return res.json();
        }
        else{
            throw new Error(`Не удалось получить данные по адресу ${url}`);
        }
    }
    getTestData = ()=>{
        return this.getData('../test.json');
    }
    getTestCard = ()=>{
        return this.getData('../card.json');
    }
    getSearchResult = query=>{
        this.temp = `${server}/search/tv?api_key=${API_KEY}&language=ru-RU&query=${query}`;
        return this.getData(this.temp);
    }
    // getNextPage = (page) =>{
    //     return this.getData(`${server}/search/tv?api_key=${API_KEY}&language=ru-RU&page=${page}`);
    // }
    getTVShow = id=>{
        return this.getData(`${server}/tv/${id}?api_key=${API_KEY}&language=ru-RU`);
    }
    getTopRated = ()=>{
        return this.getData(`${server}/tv/top_rated?api_key=${API_KEY}&language=ru-RU`);
    }
    getPopular = ()=>{
        return this.getData(`${server}/tv/popular?api_key=${API_KEY}&language=ru-RU`);
    }
    getToday = ()=>{
        return this.getData(`${server}/tv/airing_today?api_key=${API_KEY}&language=ru-RU`);
    }
    getWeek = ()=>{
        return this.getData(`${server}/tv/on_the_air?api_key=${API_KEY}&language=ru-RU`);
    }
}

const renderCard = (response, target)=>{
    tvShowList.textContent = '';

    if(!response.total_results){
        loading.remove();
        tvShowsHead.textContent = 'К сожалению по вашему запросу ничего не найдено...';
        tvShowsHead.style.cssText = 'color: red';
        return;
    }
    tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';
    tvShowsHead.style.cssText = 'color: black';
    response.results.forEach(item=>{
        const {
            backdrop_path: backdrop, 
            name: title, 
            poster_path: poster, 
            vote_average: vote,
            id
        } = item;
        const posterIMG = poster ? IMG_URL + poster : '../img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : posterIMG;
        const voteValue = vote ? `<span class="tv-card__vote">${vote}</span>`: '';

        const card = document.createElement('li');
        card.idTv = id;
        card.classList.add('.tv-shows__item');
        card.innerHTML = `
        <a href="#" id="${id}" class="tv-card">
        ${voteValue}
        <img class="tv-card__img"
             src="${posterIMG}"
             data-backdrop="${backdropIMG}"
             alt="${title}">
        <h4 class="tv-card__head">${title}</h4>
         </a>
        `;
        loading.remove();
        tvShowList.append(card);
    });
    // paginations.textContent = '';
    // if(!target && response.total_pages > 1){
    //     for(let i = 1; i <= response.total_pages; i++){
    //         paginations.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
    //     }
    // }  
};
searchForm.addEventListener('submit', event =>{
    event.preventDefault();
    const value = searchForminput.value.trim(); //trim() - убирает пробелы в начале и в конце
    if(value){
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCard);
    }
    searchForminput.value = ''; 
})

//открытие и закрытие меню
const closeDropdown = ()=>{
    dropDown.forEach(item=>{
        item.classList.remove('active');
    })
}
hamburger.addEventListener('click', ()=>{
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    closeDropdown();
});
document.addEventListener('click', (event)=>{
    if(!event.target.closest('.left-menu')){
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropdown();
    }
});
//делаем выпадающее меню

leftMenu.addEventListener('click', event=>{
    event.preventDefault();
    const target = event.target;
    const dropDown = target.closest('.dropdown');
    if(dropDown){
        dropDown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
    if (target.closest('#top-rated')){
        tvShows.append(loading);
        new DBService().getTopRated().then((response) => renderCard(response, target));
    }
    if (target.closest('#popular')){
        tvShows.append(loading);
        new DBService().getPopular().then((response) => renderCard(response, target));
    }
    if (target.closest('#today')){
        tvShows.append(loading);
        new DBService().getToday().then((response) => renderCard(response, target));
    }
    if (target.closest('#week')){
        tvShows.append(loading);
        new DBService().getWeek().then((response) => renderCard(response, target));
    }
    if(target.closest('#search')){
        tvShows.append(loading);
        new DBService().getPopular().then((response) => renderCard(response, target));
    } 
})
// открытие модального окна
tvShowList.addEventListener('click', (event)=>{
    event.preventDefault();
    const target = event.target; 
    const card = target.closest('.tv-card');
    if(card){
        preloader.style.display = 'block';
        new DBService().getTVShow(card.id)
        .then(response=>{
            if(response.poster_path){
                tvCardImg.src = IMG_URL + response.poster_path;
                tvCardImg.alt = response.name;
                posterWrapper.style.display = '';
            }
            else{
                tvCardImg.src = '../img/no-poster.jpg';
            }
            modalTitle.textContent = response.name;
        // genresList.innerHTML = response.genres.reduce((acc, item) => `${acc} <li>${item.name}</li>`, '')
            genresList.textContent = '';
            for(const item of response.genres){
                genresList.innerHTML += `<li>${item.name}</li>`;
            }
            rating.textContent = response.vote_average;
            description.textContent = response.overview;
            modalLink.href = response.homepage;
        })
        .then(()=>{
            document.body.style.overflow = 'hidden';
            modal.classList.remove('hide');
        })
        .finally(()=>{
           setTimeout(()=>{
            preloader.style.display = '';
           }, 1000);
        })
    }
});
modal.addEventListener('click', event=>{
    if(event.target.closest('.cross') || event.target.classList.contains('modal')){
        document.body.style.overflow = '';
        modal.classList.add('hide');
    } 
});
// смена изображения на карточке
const changeImage = (event) =>{
    const cardIMG = event.target.closest('.tv-card');
    if(cardIMG){
        const img = cardIMG.querySelector('.tv-card__img');
        //применяем метод деструктуризации, меняем значения местами  
        if(img.dataset.backdrop){
           [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]; 
        }
    }
};
tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);

// paginations.addEventListener('click', event=>{
//     event.preventDefault();
//     const target = event.target;
//     if(target.classList.contains('pages')){
//         tvShows.append(loading);
//         new DBService().getNextPage(target.textContent).then(renderCard);
//     }
// })