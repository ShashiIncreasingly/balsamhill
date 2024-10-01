import { irbPLPBestSeller, irbReqCart } from '@/api/irb';
import { checkPreviewMode, countryByName, getCartPageProductIds, readCookieValue } from '@/lib/helpers';
import useStore from '@/zustand/store';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import BestSellers from './modules/BestSellers';
import CustomerAlsoBought from './modules/CustomerAlsoBought';
import YouMightAlsoLike from './modules/YouMightAlsoLike';
import './styles/CartPage.scss';

function RenderBestSeller(cartExist) {
  const clientElement = document.querySelector('#inc_empty_cart_2')
  if (!clientElement) return
  const root = createRoot(clientElement);

  const previousSibling = clientElement.parentElement.previousElementSibling;
  const nextSibling = clientElement.parentElement.nextElementSibling;
  if (nextSibling) {
    nextSibling.style.display = 'none';
  }
  let TextYouMightLike = 'You Might Also Like';
  if (document.querySelector('#inc_empty_cart_1') != null && (countryByName() === 'United Kingdom' || countryByName() === 'Australia')) {
    TextYouMightLike = 'You May Also Like';
  }

  if (document.querySelector('#inc_empty_cart_2')) {
    if (document.querySelector('#inc_empty_cart_2').parentElement) {
      if (document.querySelector('#inc_empty_cart_2').parentElement.parentElement) {
        document.querySelector('#inc_empty_cart_2').parentElement.parentElement.style.setProperty('display', 'block', 'important')
      }
    }
  }
  
  root.render(
    <React.StrictMode>
      <BestSellers title={TextYouMightLike} uniqueType={'026'} />
    </React.StrictMode>,
  );
}

function RenderBestSellerLowPrice(pageConfigs) {
  const clientElement = document.querySelector('#inc_cart_2');
  if (!clientElement) return
  const root = createRoot(clientElement);

  // Cleanup Client Elements
  const previousSibling = clientElement.parentElement.previousElementSibling;
  const nextSibling = clientElement.parentElement.nextElementSibling;

  if (nextSibling) {
    nextSibling.style.display = 'none';
  }
  root.render(
    <React.StrictMode>
      <YouMightAlsoLike empty={pageConfigs.empty} />
    </React.StrictMode>,
  );
}

function CartPage({ pageConfigs }) {
  const fetchBundle = useStore((store) => store.fetchBundle);
  const cartExist = useStore((store) => store.cartExist);
  const bestSellersExist = useStore((store) => store.bestSellersExist);
  const bestSellerLowPriceExist = useStore((store) => store.bestSellerLowPriceExist);
  
  useEffect(() => {
    const fetchData = async () => {
      const ivid = readCookieValue('ivid');
      const productIDS = await getCartPageProductIds('development');
      
      const CART_URL = window.location.href.includes('balsam') ? irbReqCart(productIDS, ivid) : 'development';
      let BEST_SELLER_URL = '';
      let BEST_SELLER_LOW_PRICE = '';
  
      let countryName = countryByName();
  
      if (countryName === 'United Kingdom' || countryName === 'Australia' || countryName === 'Canada') {
        BEST_SELLER_URL = window.location.href.includes('balsam') ? irbPLPBestSeller(ivid, 'Best Sellers 30D') : 'development';
        BEST_SELLER_LOW_PRICE = window.location.href.includes('balsam') ? irbPLPBestSeller(ivid, 'Best Sellers Low Price') : 'development';
      } else {
        BEST_SELLER_URL = window.location.href.includes('balsam') ? irbPLPBestSeller(ivid, 'Best Sellers') : 'development';
        BEST_SELLER_LOW_PRICE = window.location.href.includes('balsam') ? irbPLPBestSeller(ivid, 'Best Sellers Low Price') : 'development';
      }
  
      if (pageConfigs.empty && checkPreviewMode()) {
        fetchBundle(BEST_SELLER_URL, 'Best Sellers');
      } else {
        fetchBundle(CART_URL, 'cart', productIDS);
        if (checkPreviewMode()) {
          fetchBundle(BEST_SELLER_LOW_PRICE, 'Best Sellers Low Price', productIDS);
        }
      }
    };
  
    fetchData();
  }, []);
  

  useEffect(() => {
    if (bestSellerLowPriceExist) {
      RenderBestSellerLowPrice(pageConfigs);
    }
    if (bestSellersExist) {
      RenderBestSeller();
    }
    if (cartExist){
      if (document.querySelector('#inc_cart_1')){
        document.querySelector('#inc_cart_1').parentElement.parentElement.style.setProperty("display", "block", "important");
      }
    }
  }, [bestSellersExist, cartExist, bestSellerLowPriceExist]);

  useEffect(() => {
    setTimeout(() => {
      matchRecsCategory();
    }, 2000);
  }, []);


  function matchRecsCategory() {
    if (window.location.pathname.includes('/cart')) {
      let breadcrumb = JSON.parse(document.querySelector('#__NEXT_DATA__').innerText).props.pageProps.initialState.productCategory.productListingDetailsSSR.products
      if (breadcrumb === undefined) return
      let arraysOfCategory = breadcrumb.map((pro) => pro.productType?.replace(/\s/g, ''))
      document.querySelectorAll('.inc_recs_block').forEach((prod) => prod.setAttribute('data-client-cat', arraysOfCategory))
      let allProductShowcase = document.querySelectorAll('.inc_product_showcase_block[data-foliage="true"]')
      // console.log("CATEGORIES FROM CLIENT",arraysOfCategory)
      let clicked = false;
      allProductShowcase.forEach((product) => {
        clicked = false
        let attributes = product.getAttribute('data-cat').split(',');
        if (attributes.length !== 0) {
          product.querySelectorAll('.inc_hide_attribute button').forEach((button) => {
            if (clicked == false) {
              const buttonText = button.innerText.replace(/\s/g, '');
              if (arraysOfCategory.includes(buttonText)) {
                button.click();
                clicked = true;
                // console.log("MACTHED")
              }
            }
          })
          product.querySelectorAll('.inc_attribute_hide button').forEach((button) => {
            if (clicked == false) {
              const buttonText = button.innerText.replace(/\s/g, '');
              if (arraysOfCategory.includes(buttonText)) {
                button.click()
                clicked = true
                // console.log("MACTHED")
              }else {

                // console.log("NOT MACTHED")
              }
            }
          })
        }
      });
    }
  }

  return (
    <div>
      {cartExist && <CustomerAlsoBought />}
      {!cartExist && bestSellersExist && <BestSellers title="Best Sellers" uniqueType={'025'} />}
    </div>
  );
}

export default CartPage;
