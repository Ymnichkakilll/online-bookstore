// Импортируем модули и CSS
import './styles/main.scss'; 
import './components/Slider'; 
import Sidebar from './components/Sidebar';
import BookCard from './components/BookCards';
import Api from './components/Api';
import { config } from './components/Config';

// Создаем экземпляр класса Api и класса Sidebar для отображения книг
const api = new Api();
const bookList = new Sidebar(setBooks, createBook, config);

// Устанавливаем слушатели событий на компоненте Sidebar
bookList.setListeners();

// Функция для загрузки книг в зависимости от категории
function setBooks(category) {
    // Выполняем запрос к API для получения книг
    api.getBooks(config.end, category)
        .then(({ items }) => {
            bookList.renderBooks(items);
        })
        .catch(error => {
            console.log(error);
        });
}

// Функция для создания и отображения карточки книги
function createBook(data) {
    const bookCard = new BookCard(data, config);
    bookCard.render();
}

// Загружаем список книг категории 'Architecture' при запуске приложения
bookList.setBooks('Architecture');