// создаём класс бокового меню с категориями
export default class Sidebar {
    constructor(setBooks, render, config) {
        this.render = render;
        this.setBooks = setBooks;
        this.config = config;
        this.category = 'Architecture';

        // поиск элементов в DOM-дереве
        this.bookList = document.querySelector('.book-list');
        this.categoryList = document.querySelector('.nav-sidebar');
        this.burgerMenu = document.querySelector('.burger-menu');
        this.loadMoreButton = document.querySelector('.load-more-button');

        this.toggleBurgerMenu = this.toggleBurgerMenu.bind(this);

        this.setListeners();
    }

    // тугл "активности" бургер-меню и списка категорий
    toggleBurgerMenu() {
        this.burgerMenu.classList.toggle('active');
        this.categoryList.classList.toggle('active');
    }

    setSidebarItem(evt) {
        evt.preventDefault();
        const newCategory = evt.target.dataset.category;
        this.category = newCategory;

        this.config.end = 6;
        this.loadMoreButton.style.display = 'block';

        this.setBooks(this.category);

        const activeSidebarItem = document.querySelector('.sidebar-list__item.active');
        activeSidebarItem.classList.remove('active');

        evt.target.parentNode.classList.add('active');
    }

    // кнопка подгрузки большего кол-ва книг
    setLoadMoreButton(evt) {
        if (this.config.end + 6 > 40) {
            this.config.end += 40 - this.config.end;
            this.loadMoreButton.style.display = 'none';
        } else {
            this.config.end += 6;
        }

        this.setBooks(this.category);
    }

    // обработчики событий
    setListeners() {
        this.burgerMenu.addEventListener('click', this.toggleBurgerMenu);

        document.querySelectorAll('.sidebar-list__item').forEach(el => {
            el.addEventListener('click', this.setSidebarItem.bind(this));
        });

        this.loadMoreButton.addEventListener('click', this.setLoadMoreButton.bind(this));
    }
    
    // прорисовываем карточки книг в соответствии с категорией
    renderBooks(booksData) {
        this.bookList.innerHTML = '';
        booksData.forEach(book => {
            this.render(book);
        });
    }
}