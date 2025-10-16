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

export default function Gallery({ images }) {
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
        className="mySwiper2 max-h-[330px] rounded-[20px]"
      >
        {images && images?.length > 0 ? (
          <>
            {images?.map((image, index) => {
              return (
                <SwiperSlide key={index}>
                  <img
                    src={image?.imageUrl}
                    className="rounded-[20px] w-full h-full max-h-[310px] object-contain"
                  />
                </SwiperSlide>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={5}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Navigation, Thumbs]}
        className="mySwiper"
      >
        {images && images?.length > 0 ? (
          <>
            {images?.map((image, index) => {
              return (
                <SwiperSlide key={index}>
                  <img
                    src={image?.imageUrl}
                    className="rounded-[20px] w-[71px] h-[71px] object-contain"
                  />
                </SwiperSlide>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </Swiper>
    </>
  );
}
