import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./styles.css";

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
        className="mySwiper2 lg:min-h-[385px] lg:max-h-[400px] rounded-[20px]"
      >
        {images && images?.length > 0 ? (
          <>
            {images?.map((image, index) => {
              return (
                <SwiperSlide key={index} className="w-full h-full">
                  <img
                    src={image?.imageUrl}
                    className="rounded-[20px] w-full lg:min-h-[385px] lg:max-h-[400px] object-contain"
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
                    className="rounded-lg lg:rounded-[20px] min-h-[50px] lg:min-w-[71px] lg:min-h-[71px] max-h-[71px] object-cover"
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
