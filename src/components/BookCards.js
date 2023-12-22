// импортируем SVG для звёздочек и стандартную обложку в случае отсутствия таковой в ГуглБукс
import starYellow from '../SVG/star-yellow.svg';
import starWhite from '../SVG/star-white.svg';
import defaultCover from '../images/alt-book-cover.png';

// создаём класс для карточек книг
export default class BookCard {
    constructor (data, config) {
        this.data = data;
        this.config = config;
        this.inCart = false; // флаг, указывающий, добавлена ли книга в корзину
        this.id = data.id;

        // загружаем данные о корзине и счетчик из локального хранилища
        this.storage = JSON.parse(localStorage.getItem('buyButton')) || [];
        this.cartCounter = document.querySelector('.cart__counter');
        this.cartCounter.textContent = localStorage.getItem('cart') || 0;

        this.createCardElement();
        this.updateCartCounter();
        this.checkLocalStorage()
    }

    // метод создания карточки в HTML 
    createCardElement() {
        // создаем корневой элемент карточки книги
        this.cardElement = document.createElement('div');
        this.cardElement.classList.add('book-card');

        this.createCoverImage();
        this.createBookInfo();
        this.createBuyButton();
    }
      
    // создаем изображение обложки книги
    createCoverImage() {
        const coverImage = document.createElement('img');
        coverImage.classList.add('book__cover');
        coverImage.alt = 'Bookcover';

        // устанавливаем URL обложки, если обложка не пришла с сервера, ставим стандартную
        coverImage.src = this.data.volumeInfo.imageLinks?.thumbnail || defaultCover; 
        this.cardElement.appendChild(coverImage);
    }
      
    // создаем контейнер для информации о книге
    createBookInfo() {
        this.bookInfo = document.createElement('div');
        this.bookInfo.classList.add('book-info');
      
        // добавляем информацию об авторе
        const authorInfo = document.createElement('div');
        authorInfo.classList.add('book__author');
        authorInfo.textContent = this.data.volumeInfo.authors?.join(', ');
        this.bookInfo.appendChild(authorInfo);
      
        // добавляем название книги
        const titleInfo = document.createElement('div');
        titleInfo.classList.add('book__name');
        titleInfo.textContent = this.data.volumeInfo.title;
        this.bookInfo.appendChild(titleInfo);
      
        // добавляем рейтинг и отзывы
        const ratingInfo = document.createElement('div');
        ratingInfo.classList.add('book__rating');
      
        const starsContainer = document.createElement('span');
        starsContainer.classList.add('rating__stars');
      
        // добавляем элементы звезд рейтинга
        for (let i = 1; i <= 5; i++) {
          const starImage = document.createElement('img');
          starImage.classList.add('star-icon');
          starImage.src = i <= Math.round(this.data.volumeInfo.averageRating) ? starYellow : starWhite;
          starsContainer.appendChild(starImage);
        }
      
        ratingInfo.appendChild(starsContainer);

        // добавляем информацию о рейтинге книги
        const reviewInfo = document.createElement('p');
        reviewInfo.classList.add('rating__review');
        reviewInfo.textContent = this.data.volumeInfo.ratingsCount? this.data.volumeInfo.ratingsCount + ' reviews' : 'no reviews yet';
        ratingInfo.appendChild(reviewInfo);
      
        this.bookInfo.appendChild(ratingInfo);
      
        // добавляем описание книги
        const descriptionInfo = document.createElement('div');
        descriptionInfo.classList.add('book__discription');
        descriptionInfo.textContent = this.data.volumeInfo.description;
        this.bookInfo.appendChild(descriptionInfo);
      
        // добавляем цену книги
        const priceInfo = document.createElement('div');
        priceInfo.classList.add('book__price');
        priceInfo.textContent = this.data.saleInfo.retailPrice ? `${this.data.saleInfo.retailPrice.amount} ${this.data.saleInfo.retailPrice.currencyCode}` : 'NOT FOR SALE';
        this.bookInfo.appendChild(priceInfo);
    }
      
    // добавляем кнопку покупки
    createBuyButton() {
        this.buyButton = document.createElement('button');
        this.buyButton.classList.add('buy__button');
        this.bookInfo.appendChild(this.buyButton);
      
        this.cardElement.appendChild(this.bookInfo);
    }
      
    // обновляем счетчик на значке корзины
    updateCartCounter() {
        this.cartCounter.textContent = this.config.cart;
        this.cartCounter.style.display = this.config.cart === 0 ? 'none' : 'block';
    }

    // логика добавления книги в корзину
    addToCart() {
        this.buyButton.classList.toggle('active');

        // меняем надпись на кнопке
        if (!this.inCart) {
            this.buyButton.textContent = 'in the cart';
            this.config.cart++;
        } else {
            this.buyButton.textContent = 'buy now';
            this.config.cart--;
        }

        this.inCart = !this.inCart;

        this.updateCartCounter();
        this.setLocalStorage();
    }

    // сохраняем данные о карточке книги в локальном хранилище
    setLocalStorage() {
        this.storage = this.storage.filter(el => this.id !== el.id);
        this.storage.push({
            id: this.id,
            inCart: this.inCart,
        });

        localStorage.setItem('cart', this.config.cart.toString());
        localStorage.setItem('buyButton', JSON.stringify(this.storage));
    }
    
    // при загрузке страницы, проверяем локальное хранилище на наличие в корзине книг
    // если книги есть, меняем кнопку
    checkLocalStorage() {
        const bookData = this.storage.find(item => item.id === this.id);
        if (bookData) {
            this.inCart = bookData.inCart;
        }
    
        if (this.data.saleInfo.retailPrice) {
            this.buyButton.textContent = this.inCart ? 'in the cart' : 'buy now';
            this.buyButton.classList.toggle('active', this.inCart);
        } else {
            this.buyButton.textContent = 'NOT FOR SALE';
            this.buyButton.setAttribute('disabled', true);
            this.buyButton.classList.add('active');
        }
    }
    // отрисовываем карточки книг и добавляем обработчик клика на кнопку
    render() {
        this.buyButton.addEventListener('click', () => {
            this.addToCart();
        })

        document.querySelector('.book-list').appendChild(this.cardElement);
    }
}