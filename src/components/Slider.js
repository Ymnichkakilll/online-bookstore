// импортируем картинки для слайдера
import blackFriday from '../images/blackFriday.png';
import top10 from '../images/top10.png';
import checkOut from '../images/checkOut.png';

// создаём массив с картинками для слайдера
let images = [
    {
        url: blackFriday,
    },
    {
        url: top10,
    },
    {
        url: checkOut,
    }
];

export class Slider {
    constructor(images) {
        this.images = images;
        this.currentSlide = 0;
        this.intervalId = null;
        this.autoSlideDelay = 25000; // задерка вопроизведения автопрокрутки после нажатия на точку
    }

    initSlider() {
        if (!this.images || !this.images.length) return;

        let sliderImages = document.querySelector('.slider__images');
        let sliderDots = document.querySelector('.slider__dots');

        this.initImages(sliderImages);
        this.initDots(sliderDots);

        // Запускаем автоматическую прокрутку
        this.startAutoSlide();
    }

    // код для баннеров в слайдере
    initImages(sliderImages) {
        this.images.forEach((image, index) => {
            let imageDiv = `<div class="image n${index} ${index === 0 ? "active" : ""}" style="background-image:url('${this.images[index].url}');" data-index="${index}"></div>`;
            sliderImages.innerHTML += imageDiv;
        });
    }

    // код для точек под слайдером
    initDots(sliderDots) {
        this.images.forEach((image, index) => {
            let dot = `<div class="dot n${index} ${index === 0 ? "active" : ""}" data-index="${index}"></div>`;
            sliderDots.innerHTML += dot;
        });

        sliderDots.querySelectorAll(".dot").forEach(dot => {
            dot.addEventListener("click", () => {
                this.moveSlider(dot.dataset.index);
                this.restartAutoSlide();
            });
        });
    }

    //логика прокрутки слайдов
    moveSlider(num) {
        const sliderImages = document.querySelector('.slider__images');
        const sliderDots = document.querySelector('.slider__dots');

        sliderImages.querySelector(".active").classList.remove("active");
        sliderImages.querySelector(".n" + num).classList.add("active");

        sliderDots.querySelector('.active').classList.remove('active');
        sliderDots.querySelector('.n' + num).classList.add('active');

        this.currentSlide = parseInt(num);
    }

    // добавляем автопрокрутку
    autoSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.images.length;
        this.moveSlider(this.currentSlide);
    }

    // устанавливаем интервал автопрокрутки на 5 секунд
    startAutoSlide() {
        this.intervalId = setInterval(() => {
            this.autoSlide();
        }, 5000);
    }

    // рестарт автопрокрутки после нажатия на точку
    restartAutoSlide() {
        clearInterval(this.intervalId);
        setTimeout(() => {
            this.startAutoSlide();
        }, this.autoSlideDelay);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const slider = new Slider(images);
    slider.initSlider();
});