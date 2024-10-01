import Product from '@/components/product';
import Sidebar from '@/components/sidebar';
import { countryByName } from '@/lib/helpers';
import useStore from '@/zustand/store';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/swiper.esm.js';

function BestSellers() {
  const fetchBundle = useStore((store) => store.fetchBundle);
  const bestSellersBundles = useStore((store) => store.bestSellersBundles);
  const fbtBundles = useStore((store) => store.bundles);
  const bestSellersExist = useStore((store) => store.bestSellersExist);


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
  const sidebarOpen = useStore((store) => store.sidebarOpen);
  const addToCart = useStore((store) => store.addToCart);
  const clientAddToCartResponse = useStore((store) => store.clientAddToCartResponse);
  const makeCartEmpty = useStore((store) => store.makeCartEmpty);
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
        if (!clientAddToCartResponse.errors) {
          if (!document.querySelector('#inc_cart_modal_1')) {
            handleSidebar(true);
            setIsOpen(true);
          }
        }
      }
    }
  }, [cart.length !== 0 && addToCart && sidebarExist]);

  // useEffect(() => {
  //   console.log(sidebarOpen);
  // }, [sidebarOpen]);

  const toggleDrawer = () => {
    if (document.querySelector('#inc_pdp_2').parentElement.parentElement.style.display == "none"){
      makeCartEmpty('pdp', bundlesExist);
      setTimeout(() => {
        const firstThree = document.querySelectorAll('.inc_product_add_checkbox_img.uncheked');
        for (let i = 0; i < firstThree.length; i += 1) {
          if (i < 2) {
            if (firstThree[i]){
              firstThree[i].click();
            }
          }
        }
      }, 500);
  
      setIsOpen((prevState) => !prevState);
      setTimeout(() => {
        handleSidebar(false);
      }, 100);
    }
  };

  if (!bestSellersExist) {
    return null;
  }
  let TitleExploreSimilar = 'Explore Similar Items';

  let countryName = countryByName()
  if (countryName === "United Kingdom" || countryName === "Australia") {
    TitleExploreSimilar = 'Best-Selling Similar Products';
  }


  return (
    <div className="inc_recs_block inc_recs_new_arrival_block inc_pdp_page" tabIndex="0">
      <div className="inc_af_title_block">
        {/* <h2 className="inc_af_title_text_block">{TitleExploreSimilar}</h2> */}
      </div>
      <div className="inc_recs_bundles_block">
        {/* Swiper Carousel */}

        {/* Left Navigation */}
       
          <div className={`inc_af_bundle_product_block ${bestSellersBundles.CategoryRecommendations.length === 1 && 'inc_single'}`}>
            {bestSellersBundles.CategoryRecommendations.length === 1 ? (
              <>

                {bestSellersBundles.CategoryRecommendations
                  && bestSellersBundles.CategoryRecommendations.map(
                    (product) => (

                      <Product type="recs_fbt" productObject={product} main={false} uniqueType="004" pageTid={TitleExploreSimilar === 'Explore Similar Items' ? '10' : TitleExploreSimilar === 'Best-Selling Similar Products' ? '10' : null} />

                    ),
                  )}

              </>
            ) : (
              <>
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
                  {bestSellersBundles.CategoryRecommendations
                    && bestSellersBundles.CategoryRecommendations.map(
                      (product) => (
                        <SwiperSlide key={`${product.ProductId}_bestseller`}>
                          <Product type="recs_fbt" productObject={product} main={false} uniqueType="004" pageTid={TitleExploreSimilar === 'Explore Similar Items' ? '10' : TitleExploreSimilar === 'Best-Selling Similar Products' ? '10' : null} />
                        </SwiperSlide>
                      ),
                    )}
                </Swiper>
                <div className="inc_af_bundle_nav_right" ref={(node) => setNextEl(node)} />
              </>
            )}

          </div>
        
          {sidebarOpen &&  document.querySelector('#inc_pdp_2').parentElement.parentElement.style.display == "none" && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} toggleDrawer={toggleDrawer} />}
        {/* Right Navigation */}
      </div>
    </div>
  );
}

export default BestSellers;
