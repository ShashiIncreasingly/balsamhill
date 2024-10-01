import Product from '@/components/product';
import useStore from '@/zustand/store';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/swiper.esm.js';

function MostLoved() {
  const mostLovedBundles = useStore((store) => store.mostLovedBundles);
  const bundlesExist = useStore((store) => store.bundlesExist);
  const mostLovedExist = useStore((store) => store.mostLovedExist);
  const cart = useStore((store) => store.cart);
  const sidebarExist = useStore((store) => store.sidebarExist);
  const handleSidebar = useStore((store) => store.handleSidebar);
  const addToCart = useStore((store) => store.addToCart);
  const [isOpen, setIsOpen] = React.useState(false);

  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const isBelow900 = useMediaQuery({ query: '(max-width: 1279px)' });
  const isBelow960 = useMediaQuery({ query: '(max-width: 960px)' });
  const isBelow575 = useMediaQuery({ query: '(max-width: 575px)' });
  const isBelow480 = useMediaQuery({ query: '(max-width: 480px)' });
  const isMobileBelow = useMediaQuery({ query: '(max-width: 992px)' });
  const sidebarLoading = useStore((store) => store.sidebarLoading);
  const clientAddToCartResponse = useStore((store) => store.clientAddToCartResponse)

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
      if (sidebarExist) {
        if (addToCart) {
          if (!clientAddToCartResponse.errors) {
            if (!document.querySelector('#inc_cart_modal_1')) {
              handleSidebar(true);
              setIsOpen(true);
            }
          }
        }
      } else if (sidebarLoading === 'Failed') {
        //window.location.href = '/cart';
      }
    }
  }, [cart.length !== 0 && addToCart && sidebarExist]);

  useEffect(() => {
    if (cart.length !== 0) {
      if (sidebarLoading === 'Failed') {
        //window.location.href = '/cart';
      }
    }
  }, [addToCart && sidebarLoading]);

  if (!mostLovedExist) {
    return null;
  }
  return (
    <div className="inc_recs_block inc_recs_new_arrival_block" tabindex="0">
      <div className="inc_af_title_block">
        {/* <h2 className="inc_af_title_text_block">More to Discover</h2> */}
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
              {mostLovedBundles.CategoryRecommendations.map(
                (product) => (
                  <SwiperSlide key={product.ProductId} data-id={product.ProductId}>
                    <Product type="recs_fbt" productObject={product} main={false} uniqueType="006" pageTypeId="100" pageTid="12" />
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

export default MostLoved;
