import Product from '@/components/product';
import Sidebar from '@/components/sidebar';
import useStore from '@/zustand/store';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/swiper.esm.js';

function YouMightAlsoLike() {
  const bestSellers30DBundles = useStore((store) => store.bestSellers30DBundles);
  const bestSellers30DExist = useStore((store) => store.bestSellers30DExist);
  const cart = useStore((store) => store.cart);

  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const isBelow900 = useMediaQuery({ query: '(max-width: 1279px)' });
  const isBelow960 = useMediaQuery({ query: '(max-width: 960px)' });
  const isBelow575 = useMediaQuery({ query: '(max-width: 575px)' });
  const isBelow480 = useMediaQuery({ query: '(max-width: 480px)' });
  const isMobileBelow = useMediaQuery({ query: '(max-width: 992px)' });
  const sidebarExist = useStore((store) => store.sidebarExist);
  const sidebarLoading = useStore((store) => store.sidebarLoading);
  const handleSidebar = useStore((store) => store.handleSidebar);
  const [isOpen, setIsOpen] = React.useState(false);
  const addToCart = useStore((store) => store.addToCart);

  const currentURL = useStore((store) => store.currentURL);
  const makeCartEmpty = useStore((store) => store.makeCartEmpty);
  const MostPopularExist = useStore((store) => store.MostPopularExist);

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
         
          handleSidebar(true);
          setIsOpen(true);
        }
      } else {
        ////window.location.href = '/cart';
      }
    }
  }, [cart.length !== 0 && addToCart && sidebarExist]);

  useEffect(() => {
    if (cart.length !== 0) {
      if (sidebarLoading === 'Failed') {
        //window.location.href = '/cart';
        // makeCartEmpty();
        // document.body.style.overflow = '';
        // document.querySelector('html').style.overflow = '';
      }
    }
  }, [sidebarLoading]);

  const toggleDrawer = () => {
    makeCartEmpty();
    setIsOpen((prevState) => !prevState);
    setTimeout(() => {
      handleSidebar(false);
    }, 100);
  };

  if (!bestSellers30DExist) {
    return false;
  }

  return (
    <div className="inc_recs_block inc_recs_product_list_block">
      <div className="inc_af_title_block">
        {/* <h2 className="inc_af_title_text_block">You Might Also Like</h2> */}
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
              {bestSellers30DBundles.CategoryRecommendations
                && bestSellers30DBundles.CategoryRecommendations.map(
                  (product) => (
                    <SwiperSlide key={product.ProductId}>
                      <Product type="recs" productObject={product} main={false} pageTypeId="102" pageTid="5" uniqueType="010" />
                    </SwiperSlide>
                  ),
                )}
            </Swiper>
            <div className="inc_af_bundle_nav_right" ref={(node) => setNextEl(node)} />
          </div>
       

        {/* Right Navigation */}
        { document.querySelector('#inc_plp_1') == null &&  <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} toggleDrawer={toggleDrawer} />} 
        { !MostPopularExist &&  <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} toggleDrawer={toggleDrawer} />} 
      </div>

    </div>
  );
}

export default YouMightAlsoLike;
