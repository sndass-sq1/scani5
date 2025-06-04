import { useState, useRef } from 'react';
import { Swiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

const SwiperComp = ({ children }) => {
    const swiperRef = useRef(null);
    const [hidePrev, setHidePrev] = useState(true);

    return (
        <>
            <div className="Stats-content">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={10}
                    slidesPerView={4}
                    navigation={{
                        prevEl: '.custom-prev',
                        nextEl: '.custom-next',
                    }}
                    pagination={{ clickable: false }}
                    breakpoints={{
                        1440: { slidesPerView: 5 },
                        1366: { slidesPerView: 4 },
                        1024: { slidesPerView: 4 },
                        768: { slidesPerView: 3 },
                        480: { slidesPerView: 2 },
                        320: { slidesPerView: 2 },
                    }}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={(swiper) => {
                        setHidePrev(swiper.isBeginning);
                    }}>
                    {children}
                </Swiper>
            </div>
            <div className="swiper-button">
                <button
                    className={`custom-prev ${hidePrev ? 'hidden' : ''}`}
                    onClick={() => swiperRef.current?.slidePrev()}>
                    <FaAngleLeft />
                </button>
                <button className="custom-next" onClick={() => swiperRef.current?.slideNext()}>
                    <FaAngleRight />
                </button>
            </div>
        </>
    );
};

export default SwiperComp;
