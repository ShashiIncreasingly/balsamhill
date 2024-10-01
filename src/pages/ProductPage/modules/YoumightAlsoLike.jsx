import ExtendedWarranty from '@/components/ExtendedWarranty';
import Product from '@/components/product';
import { countryByName, decodeEntity, formatter } from '@/lib/helpers';
import useStore from '@/zustand/store';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/swiper.esm.js';

function YoumightAlsoLike() {
  const moreToDiscoverBundles = useStore((store) => store.moreToDiscoverBundles);
  const moreToDiscoverExist = useStore((store) => store.moreToDiscoverExist);
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
  const addToCart = useStore((store) => store.addToCart);
  const extendedWarranty = useStore((store) => store.extendedWarranty);
  const clientAddToCartResponse = useStore((store) => store.clientAddToCartResponse);
  const swiperConfig = {
    sliderPerView: 3,
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
      }
    }
  }, [cart.length !== 0 && addToCart && sidebarExist]);

  const ref = useRef(null);


  useEffect(() => {
    if (document.querySelector('#inc_cart_modal_1')) {
      if (addToCart) {

        if (clientAddToCartResponse.errors) return;
        
        // console.log(clientAddToCartResponse);
        // console.log('value', clientAddToCartResponse.entry.basePrice.value);
        // console.log('qtyadded', clientAddToCartResponse.quantityAdded);
        const parent = document.querySelector('.modalContainer_modal-body__jiOSN.modal-body');
        const image = parent.querySelector('.productAddToCartModal_image-wrapper__YbdMM').querySelector('img');
        const title = parent.querySelector('.productAddToCartModal_title__P67IJ');
        const wrapper = parent.querySelector('.productAddToCartModal_meta-wrapper__oQLo9');
        image.src = 'https://source.widen.net/content/sidrd3xcvd/jpeg/bh_img_missing_vertical.jpeg?keep=c&crop=yes&color=cccccc&quality=70&u=giheaf';
        if (clientAddToCartResponse.entry.product.images) {
          if (clientAddToCartResponse.entry.product.images[0]) {
            if (clientAddToCartResponse.entry.product.images[0].url) {
              image.src = clientAddToCartResponse.entry.product.images[0].url;
            }
          }
        }

        
        title.innerHTML = `<span>${clientAddToCartResponse.entry.product.name}</span> <span> Added to ${countryByName() === 'United Kingdom' ? 'Basket' : 'Cart'}</span>`;
        wrapper.innerHTML = '';
        const qtyDiv = document.createElement('div');
        qtyDiv.classList.add('productAddToCartModal_meta-item__L7gWy');

        qtyDiv.innerHTML = `<span>Qty:</span><span>&nbsp;${clientAddToCartResponse?.quantityAdded}</span>`;
        wrapper.appendChild(qtyDiv);
        let variants = null
        let isCombo = null
        
        if (clientAddToCartResponse.entry.product.baseOptions) {

          variants = clientAddToCartResponse.entry.product.baseOptions[0].selected.variantOptionQualifiers;
          isCombo = variants[0].name.includes('Wildcard');
        }
        let valuesV = document.querySelectorAll('#inc_cart_modal_1 div[data-activeid="' + clientAddToCartResponse.entry.product.code + '"] .inc_attribute_hide .inc_active')

        let valuesV2 = document.querySelectorAll('#inc_cart_modal_1 div[data-activeid="' + clientAddToCartResponse.entry.product.code + '"] .inc_hide_attribute .inc_modal_combo_block_item.inc_active .inc_product_modal_combo_attributes')
        
        
        if (valuesV2.length !== 0){
          isCombo = true
        }
        
        


        if (!isCombo) {
          if (variants) {
            variants.map((variant, index) => {
              const values = variant.value;
              const div = document.createElement('div');
              div.classList.add('productAddToCartModal_meta-item__L7gWy');
              div.innerHTML = `<span>${variant.name}: </span><span>${decodeEntity(valuesV[index]?.innerText)}</span>`;
              wrapper.appendChild(div);
            });
          }

        } else {
          if (variants) {
            variants.map((variant, index) => {
              const values = variant.value;
              const div = document.createElement('div');
              div.classList.add('productAddToCartModal_meta-item__L7gWy');
              div.innerHTML = `<span>${decodeEntity(valuesV2[index]?.innerText)}</span>`;
              wrapper.appendChild(div);
            });
          }
        }
        const totalPrice = clientAddToCartResponse.entry.basePrice.value * clientAddToCartResponse.quantityAdded;
        // console.log('total', totalPrice);
        const price = document.createElement('div');
        price.classList.add('productAddToCartModal_meta-item__L7gWy');
        price.innerHTML = `<span>Price: </span><span>${formatter.format(totalPrice)}</span>`;

        wrapper.appendChild(price);

        /// APPEND EXTENED
        if (document.querySelector('.inc_extended_warranty')) {
          document.querySelector('.inc_extended_warranty').remove();
        }
        if (extendedWarranty.length !== 0) {
          const clientElement =document.querySelector('.productAddToCartModal_cart-items-list__4R0Iy')
          if (document.querySelector('.productAddToCartModal_cart-items-bg-wrapper__PUb66')) {
            document.querySelector('.productAddToCartModal_cart-items-bg-wrapper__PUb66').remove();
          }
          const newRoot = document.createElement('div');
          newRoot.classList.add('inc_extended_warranty');
          clientElement.appendChild(newRoot);
          const root = createRoot(newRoot);

          root.render(
            <React.StrictMode>
              <ExtendedWarranty />
            </React.StrictMode>,
          );
        } else {
          if (document.querySelector('.productAddToCartModal_cart-items-bg-wrapper__PUb66')) {
            document.querySelector('.productAddToCartModal_cart-items-bg-wrapper__PUb66').remove();
          }
        }

        // const checkforclientpopup = setInterval(() => {
        //   if (document.querySelector('.add-to-cart-modal') === null) {
        //     clearInterval(checkforclientpopup);
        //     // window.location.href = '/cart';
        //   }
        // }, 2000);
      }
    }

  }, [addToCart && clientAddToCartResponse.length !== 0]);
  if (!moreToDiscoverExist) {
    return null;
  }

  return (
    <div className="inc_recs_block inc_recs_new_arrival_block" tabIndex="0">
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
              {moreToDiscoverBundles.CategoryRecommendations
                && moreToDiscoverBundles.CategoryRecommendations.map(
                  (product) => (
                    <SwiperSlide key={product.ProductId}>
                      <Product type="recs_fbt" productObject={product} specialType="softcart" bundleTypes="FBT" main={false} uniqueType="005"  pageTypeId="117" pageTid="20"/>
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

export default YoumightAlsoLike;
