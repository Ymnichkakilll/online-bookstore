    // Метод для получения списка книг из Google Books API
    // По умолчанию возвращает первые 6 книг категории 'Architecture'
    // end - количество книг для запроса
    // category - категория книг для поиска

export default class Api {

    getBooks(end = 6, category = 'Architecture'){
        // Выполняем запрос к Google Books API
        return fetch(`https://www.googleapis.com/books/v1/volumes?q="subject:${category}"&key=AIzaSyAIHP_TkLkxcJSBIxOd9OuZH9rwpR4EaGI&printType=books&startIndex=0&maxResults=${end}&langRestrict=en`)
            .then(response => {
                // Проверяем, успешно ли выполнен запрос (статус 200 OK)
                if (response.ok) {
                   return response.json(); // Разбираем ответ в JSON и возвращаем его
                }
                // Возвращаем отклоненное обещание с HTTP-статусом в случае ошибки
                return Promise.reject(response.status);
            })
    }
}