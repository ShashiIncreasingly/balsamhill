import Product from '@/components/product';
import { countryByName } from '@/lib/helpers';
import useStore from '@/zustand/store';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/swiper.esm.js';

function YouMightAlsoLike({ empty }) {
  const bestSellerLowPriceBundles = useStore((store) => store.bestSellerLowPriceBundles);
  const bestSellerLowPriceExist = useStore((store) => store.bestSellerLowPriceExist);

  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const isBelow900 = useMediaQuery({ query: '(max-width: 1279px)' });
  const isBelow960 = useMediaQuery({ query: '(max-width: 960px)' });
  const isBelow575 = useMediaQuery({ query: '(max-width: 575px)' });
  const isBelow480 = useMediaQuery({ query: '(max-width: 480px)' });
  const isMobileBelow = useMediaQuery({ query: '(max-width: 992px)' });
  const cart = useStore((store) => store.cart);
  const addToCart = useStore((store) => store.addToCart);
  const sidebarLoading = useStore((store) => store.sidebarLoading);
  const addedFrom = useStore((store) => store.addedFrom);
  const [isEmpty, setIsEmpty] = useState(false)

  const swiperConfig = {
    sliderPerView: 4,
    freeMode: true,
  };

  if (isBelow900) {
    swiperConfig.sliderPerView = 3;
    swiperConfig.freeMode = true;
  }

  if (isBelow900) {
    swiperConfig.sliderPerView = 3;
    swiperConfig.freeMode = true;
  }
  if (isBelow960) {
    swiperConfig.sliderPerView = 2.5;
    swiperConfig.freeMode = true;
  }

  if (isBelow575) {
    swiperConfig.sliderPerView = 1.5;
    swiperConfig.freeMode = true;
  }

  useEffect(() => {
    if (cart.length !== 0) {
      if (addedFrom === 'recs') {
        setTimeout(() => {
          const params = new URLSearchParams(window.location.search)
          if (params && params?.get("asm") === "true") {
           
            window.location.href = '/cart?asm=true'

          } else {
            window.location.href = '/cart'
          }
        }, 2500);
      }
    }

  }, [addToCart]);

  if (!bestSellerLowPriceExist) {
    return null;
  }
  let TitleYouMightLike = 'You Might Also Like';

  let countryName = countryByName()
  if (countryName === "United Kingdom" || countryName === "Australia") {

    TitleYouMightLike = 'Best-Selling Similar Products';
    if (isEmpty) {
      TitleYouMightLike = 'You May Also Like';
    }
  }

  return (
    <div className="inc_recs_block inc_recs_new_arrival_block">
      <div className="inc_af_title_block">
        {/* <h2 className="inc_af_title_text_block">{TitleYouMightLike}</h2> */}
      </div>
      <div className="inc_recs_bundles_block">
        {/* Swiper Carousel */}

        {/* Left Navigation */}

        <div className="inc_af_bundle_product_block">
          <div className="inc_af_bundle_nav_left" ref={(node) => setPrevEl(node)} />
          <Swiper
            spaceBetween={0}
            modules={[Navigation]}
            slidesPerView={swiperConfig.sliderPerView}
            allowTouchMove={swiperConfig.freeMode}
            freeMode={swiperConfig.freeMode}
            navigation={{ prevEl, nextEl, disabledClass: 'inc_disabled' }}
            draggable
          >
            {bestSellerLowPriceBundles.CategoryRecommendations
              && bestSellerLowPriceBundles.CategoryRecommendations.map(
                (product) => (
                  <SwiperSlide key={product.ProductId}>
                    <Product type="recs" productObject={product} main={false} uniqueType="020" pageTypeId="103" pageTid={isEmpty ? "16" : "14"} />
                  </SwiperSlide>
                ),
              )}
          </Swiper>
          <div className="inc_af_bundle_nav_right" ref={(node) => setNextEl(node)} />
        </div>

        {/* Right Navigation */}
      </div>
    </div>
  );
}

export default YouMightAlsoLike;
