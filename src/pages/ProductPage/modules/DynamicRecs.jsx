import { bundleViewTracking } from '@/api/tracking';
import Product from '@/components/product';
import useStore from '@/zustand/store';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation } from 'swiper/swiper.esm.js';
import 'swiper/swiper.min.css';

function DynamicRecs({ bundles }) {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const isBelow900 = useMediaQuery({ query: '(max-width: 1279px)' });
  const isBelow960 = useMediaQuery({ query: '(max-width: 960px)' });
  const isBelow575 = useMediaQuery({ query: '(max-width: 575px)' });
  const isBelow480 = useMediaQuery({ query: '(max-width: 480px)' });
  const isMobileBelow = useMediaQuery({ query: '(max-width: 992px)' });
  const [isOpen, setIsOpen] = React.useState(false);
  const cart = useStore((store) => store.cart);
  const sidebarExist = useStore((store) => store.sidebarExist);
  const handleSidebar = useStore((store) => store.handleSidebar);
  const addToCart = useStore((store) => store.addToCart);
  const sidebarLoading = useStore((store) => store.sidebarLoading);
  const bundlesExist = useStore((store) => store.bundlesExist);

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
      if (addToCart) {
        if (!document.querySelector('#inc_cart_modal_1')) {
          handleSidebar(true);
          setIsOpen(true);
        }
      }
    }
  }, [cart.length !== 0 && addToCart && sidebarExist]);

  useEffect(() => {
    if (cart.length !== 0) {
      //window.location.href = '/cart';
    }
  }, [addToCart === true && sidebarLoading === 'Failed']);

  const [ref, inView] = useInView({
    /* Optional options */
    triggerOnce: true,
    rootMargin: '0px 0px',
  });

  useEffect(() => {
    if (inView && bundlesExist === false){
      bundleViewTracking();
    }
  }, [inView]);

  return (
    <div ref={ref} className="inc_recs_block inc_pdp_page" style={{background:'#f3f3f3'}} tabindex="0">
      <div className="inc_af_title_block">
        {/* <h2 className="inc_af_title_text_block">Best Selling Similar Products</h2> */}
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
              {bundles.CategoryRecommendations
                && bundles.CategoryRecommendations.map(
                  (product) => (
                    <SwiperSlide key={product.ProductId} data-id={product.ProductId}>
                      <Product type="recs" productObject={product} main={false} uniqueType="001" />
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

export default DynamicRecs;
