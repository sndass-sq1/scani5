import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const LoginSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const slides = [
        {
            image: '/images/slide-1.png',
            title: 'Slide 1',
            description: 'Vulnerability Management, Detection and Response.',
        },
        {
            image: '/images/slide-2.png',
            title: 'Slide 2',
            description: 'Vulnerability Management, Detection and Response.',
        },
        {
            image: '/images/slide-3.png',
            title: 'Slide 3',
            description: 'Vulnerability Management, Detection and Response.',
        },
    ];

    return (
        <div className="carousel-bg">
            <div className="slider-wrapper">
                <Slider {...settings}>
                    {slides.map((slide, index) => (
                        <div key={index} className="slider-wrapper-content">
                            <div className="slide-img-wrapper">
                                <img
                                    className="slide-img"
                                    src={slide.image}
                                    alt={slide.title}
                                    width={300}
                                />
                            </div>

                            <div className="slide-descpt">
                                <p>{slide.description}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};
