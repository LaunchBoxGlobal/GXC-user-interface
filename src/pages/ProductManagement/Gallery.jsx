import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import "./styles.css";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

export default function Gallery() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 max-h-[310px] rounded-[20px]"
      >
        <SwiperSlide>
          <img
            src="https://swiperjs.com/demos/images/nature-1.jpg"
            className="rounded-[20px]"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-5.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-6.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-7.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-8.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-9.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-10.jpg" />
        </SwiperSlide>
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Navigation, Thumbs]}
        className="mySwiper"
      >
        <SwiperSlide className="rounded-[10px]">
          <img
            src="https://swiperjs.com/demos/images/nature-1.jpg"
            className="rounded-[20px]"
          />
        </SwiperSlide>
        <SwiperSlide className="rounded-[10px]">
          <img
            src="https://swiperjs.com/demos/images/nature-2.jpg"
            className="rounded-[20px]"
          />
        </SwiperSlide>
        <SwiperSlide className="rounded-[10px]">
          <img
            src="https://swiperjs.com/demos/images/nature-3.jpg"
            className="rounded-[20px]"
          />
        </SwiperSlide>
        <SwiperSlide className="rounded-[10px]">
          <img
            src="https://swiperjs.com/demos/images/nature-4.jpg"
            className="rounded-[20px]"
          />
        </SwiperSlide>
        <SwiperSlide className="rounded-[10px]">
          <img
            src="https://swiperjs.com/demos/images/nature-5.jpg"
            className="rounded-[20px]"
          />
        </SwiperSlide>
        <SwiperSlide className="rounded-[10px]">
          <img
            src="https://swiperjs.com/demos/images/nature-6.jpg"
            className="rounded-[20px]"
          />
        </SwiperSlide>
        <SwiperSlide className="rounded-[10px]">
          <img
            src="https://swiperjs.com/demos/images/nature-7.jpg"
            className="rounded-[20px]"
          />
        </SwiperSlide>
        <SwiperSlide className="rounded-[10px]">
          <img
            src="https://swiperjs.com/demos/images/nature-8.jpg"
            className="rounded-[20px]"
          />
        </SwiperSlide>
        <SwiperSlide className="rounded-[10px]">
          <img
            src="https://swiperjs.com/demos/images/nature-9.jpg"
            className="rounded-[20px]"
          />
        </SwiperSlide>
        <SwiperSlide className="rounded-[10px]">
          <img
            src="https://swiperjs.com/demos/images/nature-10.jpg"
            className="rounded-[20px]"
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
