import Product from '@/components/product';
import useStore from '@/zustand/store';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation } from 'swiper/swiper.esm.js';
import 'swiper/swiper.min.css';

import Loader from '@/components/loader';



function NewArrivalsRender() {
  const miniRecs = document.querySelector('#inc_empty_cart_2');
  const newRoot = document.createElement('div');
  newRoot.id = 'increasingly_root_3';
  miniRecs.appendChild(newRoot);
  const root = ReactDOM.createRoot(newRoot);
  const previousSibling = document.querySelector('#inc_empty_cart_2').parentElement.previousElementSibling;
  // previousSibling.style.padding = '0px';
  // previousSibling.style.display = 'none';
  // Rendering New Arrivals
  root.render(
    <React.StrictMode>

    </React.StrictMode>,
  );
}

function CartPageRecommendationRender() {
  const miniRecs = document.querySelector('#inc_cart_2');
  const newRoot = document.createElement('div');
  newRoot.id = 'increasingly_cart_root_2';
  miniRecs.appendChild(newRoot);
  const root = ReactDOM.createRoot(newRoot);
  const previousSibling = document.querySelector('#inc_cart_2').parentElement.previousElementSibling;

  // previousSibling.style.padding = '0px';
  // previousSibling.style.display = 'none';
  // Rendering New Arrivals
  root.render(
    <React.StrictMode>

    </React.StrictMode>,
  );
}

function CustomerAlsoBought({ pageConfigs }) {
  const cartBundles = useStore((store) => store.cartBundles);
  const cartExist = useStore((store) => store.cartExist);

  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  const isBelow900 = useMediaQuery({ query: '(max-width: 1279px)' });
  const isBelow960 = useMediaQuery({ query: '(max-width: 960px)' });
  const isBelow575 = useMediaQuery({ query: '(max-width: 575px)' });
  const isBelow480 = useMediaQuery({ query: '(max-width: 480px)' });
  const isMobileBelow = useMediaQuery({ query: '(max-width: 992px)' });
 

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
  let productsCart=[]
  if (cartBundles.Bundles != null) {
    for (let c = 0; c < cartBundles.Bundles.length; c += 1) { 
      for (let d = 0; d < cartBundles.ProductsDetail.length; d += 1) {
        // productsCart.push
        if (productsCart.indexOf(cartBundles.Bundles[c].ProductIds[0]) === -1) {
          if (cartBundles.Bundles[c].ProductIds[0] === cartBundles.ProductsDetail[d].ProductId) {
            cartBundles.ProductsDetail[d].MainproductId = cartBundles.Bundles[c].ProductIds[1];
            productsCart.push(cartBundles.Bundles[c].ProductIds[0]);
          }
        }
        if (productsCart.indexOf(cartBundles.Bundles[c].ProductIds[1]) === -1) {
          if (cartBundles.Bundles[c].ProductIds[1] === cartBundles.ProductsDetail[d].ProductId) {
            cartBundles.ProductsDetail[d].MainproductId = cartBundles.Bundles[c].ProductIds[0];
            productsCart.push(cartBundles.Bundles[c].ProductIds[1]);
          }
        }
      }
    }
  }
  if (!cartExist) {
    return <Loader />;
  }
  return (
    <div className="inc_af_block inc_af_cart_page inc_recs_block">
      <div className="inc_af_title_block">
        {/* <h2 className="inc_af_title_text_block">Frequently Bought Together</h2> */}
      </div>
      <div className="inc_af_bundles_block">
        {/* Swiper Carousel */}

        {/* Left Navigation */}

       
          <div className="inc_af_bundle_product_block">
            {' '}
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
              {cartBundles.ProductsDetail
                && cartBundles.ProductsDetail.map(
                  (product, idx) => (
                    product.Attributes !== null && (
                      <SwiperSlide key={product.ProductId}>
                        <Product type="cart" productObject={product} main={false} uniqueType="019" pageTypeId="103" pageTid="13" />
                      </SwiperSlide>
                    )
                  ),
                )}
            </Swiper>
            {' '}
            <div className="inc_af_bundle_nav_right" ref={(node) => setNextEl(node)} />
          </div>
        

        {/* Right Navigation */}

      </div>
    </div>
  );
}

export default CustomerAlsoBought;
