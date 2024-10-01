/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { irbRecommendation, irbReq, irbReqRecommendation, irbReqSidebar } from '@/api/irb';
import Sidebar from '@/components/sidebar';
import { checkPreviewMode, countryByName, getProductIdFromWebPage, getURLBasedCountryCode, readCookieValue, } from '@/lib/helpers';
import useStore from '@/zustand/store';
import BestSellers from './modules/BestSellers';
import FBT from './modules/FBT';
import MoreToDiscover from './modules/MoreToDiscover';
import MostLoved from './modules/MostLoved';
import YoumightAlsoLike from './modules/YoumightAlsoLike';
import './styles/ProductPage.scss';
import './styles/RecommendationPage.scss';

function RenderBestSeller() {
  const clientElement = document.querySelector('#inc_pdp_3');
  if (!clientElement) return;

  // Check if the 'inc_manual_recs' element already exists
  if (clientElement.querySelector('.inc_manual_recs')) return;

  // Create new element and add class
  const newElement = document.createElement('div');
  newElement.classList.add('inc_manual_recs');

  // Hide the next sibling element
  const parentElement = clientElement.parentElement;
  if (parentElement) {
    const nextSibling = parentElement.nextElementSibling;
    if (nextSibling) {
      nextSibling.style.display = 'none';
    }

    // Set the background color of the grandparent element
    const grandparentElement = parentElement.parentElement;
    if (grandparentElement) {
      grandparentElement.style.background = '#fff';

      // Ensure the display property is set to 'block'
      grandparentElement.style.setProperty('display', 'block', 'important');
    }

    // Ensure the previous sibling element is visible
    const previousSibling = parentElement.previousElementSibling;
    if (previousSibling) {
      previousSibling.style.display = 'block';
    }
  }

  // Append new element and render React component
  clientElement.appendChild(newElement);
  const root = createRoot(newElement);
  root.render(
    <React.StrictMode>
      <BestSellers />
    </React.StrictMode>,
  );
}

function RenderMoreToDiscover() {
  const clientElement = document.querySelector('#inc_cart_modal_1');
  // if (!clientElement) return
  if (clientElement) {
    if (clientElement.querySelector('.inc_manual_recs.inc_client_softcart')) return;
    const newElement = document.createElement('div');
    newElement.classList.add('inc_manual_recs', 'inc_client_softcart');
    clientElement.appendChild(newElement);
    const root = createRoot(newElement);
    root.render(
      <React.StrictMode>
        <MoreToDiscover />
      </React.StrictMode>,
    );
  }
}
function RenderYouMightAlsoLike() {
  let clientElement = document.querySelector('#inc_cart_modal_1');
  if (clientElement == null) {
    const clientmodal = document.querySelector('.add-to-cart-modal .modal-body');
    const incmodaldiv = document.createElement('div');
    incmodaldiv.id = 'inc_cart_modal_1';
    clientmodal.appendChild(incmodaldiv);
  }
  clientElement = document.querySelector('#inc_cart_modal_1');
  if (clientElement.querySelector('.inc_manual_recs.inc_client_softcart')) return;
  const newElement = document.createElement('div');
  newElement.classList.add('inc_manual_recs', 'inc_client_softcart');
  clientElement.appendChild(newElement);
  const root = createRoot(newElement);
  root.render(
    <React.StrictMode>
      <YoumightAlsoLike />
    </React.StrictMode>,
  );
}

function RenderMostLoved() {
  let clientElement = document.querySelector('#inc_pdp_1');
  if (!clientElement) return
  const root = createRoot(clientElement);

  // Cleanup Client Elements
  if (document.querySelector('#inc_pdp_1')) {
    const nextSibling = document.querySelector('#inc_pdp_1').parentElement.nextElementSibling;
    if (nextSibling) {
      nextSibling.style.display = 'none';
    }
  }
  if (document.querySelector('#inc_pdp_1')) {
    if (document.querySelector('#inc_pdp_1').parentElement) {
      if (document.querySelector('#inc_pdp_1').parentElement.parentElement) {
        document.querySelector('#inc_pdp_1').parentElement.parentElement.style.setProperty("display", "block", "important");
        // console.log("ENABLED")
        if ( document.querySelector('#inc_pdp_1').parentElement.previousElementSibling) {
          document.querySelector('#inc_pdp_1').parentElement.previousElementSibling.style.display = "block"
        }
      }
    }
  }

  root.render(
    <React.StrictMode>
      <MostLoved />
    </React.StrictMode>,
  );
}

function ProductPage() {
  const fetchBundle = useStore((store) => store.fetchBundle);

  let bundles = useStore((store) => store.bundles);
  const recommendation = useStore((store) => store.recommendation);

  const recsExist = useStore((store) => store.recsExist);
  const bundlesExist = useStore((store) => store.bundlesExist);

  const bestSellersExist = useStore((store) => store.bestSellersExist);
  const mostLovedExist = useStore((store) => store.mostLovedExist);
  const moreToDiscoverExist = useStore((store) => store.moreToDiscoverExist);
  const handleSidebar = useStore((store) => store.handleSidebar);

  const sidebarOpen = useStore((store) => store.sidebarOpen);
  const [isOpen, setIsOpen] = React.useState(false);
  const makeCartEmpty = useStore((store) => store.makeCartEmpty);
  const setClientModal = useStore((store) => store.setClientModal);
  const [productID, setProductID] = useState(null);
  useEffect(() => {
    const checkForProductId = () => {
      const id = getProductIdFromWebPage();
      if (id) {
        setProductID(id);
        return true; // Indicates a valid product ID was found
      }
      return false; // Indicates no valid product ID
    };

    // Initial check
    let foundId = checkForProductId();
    
    // Set up an interval to check for PRODUCTID
    const intervalId = setInterval(() => {
      foundId = checkForProductId();
      if (foundId) {
        clearInterval(intervalId);
      }
    }, 1000); // Check every second

    // Clear the interval after 5 seconds
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (!foundId) {
        console.log('No PRODUCTID found after 5 seconds.');
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);
  useEffect(() => {
    if (productID) {
      const ivid = readCookieValue('ivid');
      
      const FBT_URL = window.location.href.includes('balsam') ? irbReq(productID, 'b17s0mReQ6UK', ivid) : 'development';
      const SIDEBAR_URL = window.location.href.includes('balsam') ? irbReqSidebar(productID, ivid) : 'development';
      let YOUMIGHTALSOLIKE_URL = '';
      const countryName = countryByName();
      
      if (countryName === 'United Kingdom' || countryName === 'Australia') {
        YOUMIGHTALSOLIKE_URL = window.location.href.includes('balsam') ? irbRecommendation(ivid, 'Best Sellers Unit Sold') : 'development';
      }
      
      if (document.querySelector('#inc_pdp_2')) {
        fetchBundle(FBT_URL, 'pdp');
      }
      
      fetchBundle(SIDEBAR_URL, 'sidebar');
      
      if ((countryName === 'United Kingdom' || countryName === 'Australia') && checkPreviewMode()) {
        fetchBundle(YOUMIGHTALSOLIKE_URL, 'More to discover');
      }

      if (document.querySelector('#inc_pdp_3') && checkPreviewMode()) {
        const BESTSELLER_URL = window.location.href.includes('balsam') ? irbReqRecommendation(productID, ivid, null) : 'development';
        fetchBundle(BESTSELLER_URL, 'Best Sellers');
      }
    }
  }, [productID]);
  // useEffect(() => {
  //   const productID = getProductIdFromWebPage();
  //   const ivid = readCookieValue('ivid');

  //   const FBT_URL = window.location.href.includes('balsam') ? irbReq(productID, 'b17s0mReQ6UK', ivid) : 'development';
  //   const SIDEBAR_URL = window.location.href.includes('balsam') ? irbReqSidebar(productID, ivid) : 'development';
  //   let YOUMIGHTALSOLIKE_URL = '';
  //   const countryName = countryByName();
  //   if (countryName === 'United Kingdom' || countryName === 'Australia') {
  //     YOUMIGHTALSOLIKE_URL = window.location.href.includes('balsam') ? irbRecommendation(ivid, 'Best Sellers Unit Sold') : 'development';
  //   }
  //   if (document.querySelector('#inc_pdp_2') && productID !== null && productID !== undefined) {
  //     fetchBundle(FBT_URL, 'pdp');
  //   }
  //   if (productID !== null && productID !== undefined) {
  //     fetchBundle(SIDEBAR_URL, 'sidebar');
  //   }
  //   if ((countryName === 'United Kingdom' || countryName === 'Australia') && checkPreviewMode()) {
  //     fetchBundle(YOUMIGHTALSOLIKE_URL, 'More to discover');
  //   }

  //   if (document.querySelector('#inc_pdp_3') && checkPreviewMode()) {
  //     const BESTSELLER_URL = window.location.href.includes('balsam') ? irbReqRecommendation(productID, ivid, null) : 'development';
  //     fetchBundle(BESTSELLER_URL, 'Best Sellers');
  //   }
  // }, []);

  function getChildID(price) {
    const productInfo = JSON.parse(document.querySelector('#productschema').innerText);
    let foundID = getProductIdFromWebPage();
    if (productInfo.offers) {
      foundID = productInfo.offers.find((prod) => prod.price === price).sku;
    }

    return foundID;
  }

  function prepareObj(no_fbt) {
    let clientActivePrice = 0;
    let clientSpecialPrice = 0;
    // GET CLIENT PRICE
    const clientActiveElement = document.querySelector('.productPrice_old-price__fOKyY');
    const clientSpecialElement = document.querySelector('.productPrice_new-price__tLgIi');

    if (clientActiveElement == null || clientSpecialElement === undefined) {
      clientActivePrice = clientSpecialElement.innerText.replace(/^\D+/g, '').replace(',', '').toString();
      clientSpecialPrice = '';
    } else {
      clientActivePrice = clientActiveElement.innerText.replace(/^\D+/g, '').replace(',', '').toString();
      clientSpecialPrice = clientSpecialElement.innerText.replace(/^\D+/g, '').replace(',', '').toString();
    }
    const priceMismatchObj = {};
    let activeID = getProductIdFromWebPage();

    if (no_fbt) {
      activeID = getChildID(clientActivePrice);
    }

    priceMismatchObj.product_id = activeID;
    priceMismatchObj.product_price = clientActivePrice;
    priceMismatchObj.special_price = clientSpecialPrice;

    return priceMismatchObj;
  }

  const clientRef = useRef(null);
  const clientAddToCart = document.querySelector('button[data-testid="pdc-btn-addtocart"]');
  const clientOutOfStock = document.querySelector('button[data-testid="pdc-btn-notifyme"]');
  if (clientAddToCart) {
    clientRef.current = clientAddToCart;
    clientRef.current.addEventListener('click', () => {
      const clientAddToCartModal = setInterval(() => {
        if (document.querySelector('.add-to-cart-modal')) {
          clearInterval(clientAddToCartModal);
          setClientModal(true)
          if (countryByName() === 'United Kingdom' || countryByName() === 'Australia') {
            if (moreToDiscoverExist) {
              RenderYouMightAlsoLike();
            }
          } else if (bundlesExist) {
            RenderMoreToDiscover();
          }
        }
      }, 500);
      setTimeout(() => {
        clearInterval(clientAddToCartModal);
      }, 5000);
    });
  }

  if (clientOutOfStock) {
    if (document.querySelector('.productDetailContainer_product-filter-wrapper___kJ9O')) {
      document.querySelector('.productDetailContainer_product-filter-wrapper___kJ9O').addEventListener('click', () => {
        setTimeout(() => {
          const clientAddToCart2 = document.querySelector('button[data-testid="pdc-btn-addtocart"]');
          if (clientAddToCart2) {
            clientRef.current = clientAddToCart2;
            clientRef.current.addEventListener('click', () => {
              const clientAddToCartModal = setInterval(() => {
                if (document.querySelector('.add-to-cart-modal')) {
                  clearInterval(clientAddToCartModal);
                  setClientModal(true)
                    if (countryByName() === 'United Kingdom' || countryByName() === 'Australia') {
                      if (moreToDiscoverExist) {
                        RenderYouMightAlsoLike();
                      }
                    } else {
                      if (bundlesExist) {
                        RenderMoreToDiscover();
                      }
                    }
                  
                }
              }, 500);
              setTimeout(() => {
                clearInterval(clientAddToCartModal);
              }, 5000);
            });
          }
        }, 1000);
      });
    }
  }
  
  const toggleDrawer = () => {
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
  };

  useEffect(() => {
    if (bestSellersExist) {
      RenderBestSeller(recsExist);
    }
  }, [bestSellersExist]);

  useEffect(() => {
    if (mostLovedExist) {
      RenderMostLoved();
    }
  }, [mostLovedExist]);

  useEffect(() => {
    if (sidebarOpen) {
      if (!document.querySelector('#inc_cart_modal_1')) {
        setIsOpen(true);
      }
    }
  }, [sidebarOpen]);

  useEffect(() => {
    setTimeout(() => {
      matchRecsCategory();
    }, 2000);
  }, [])


  function matchRecsCategory() {
    if (window.location.pathname.includes('/p/')) {
      let breadcrumb = JSON.parse(document.querySelector('#__NEXT_DATA__').innerText).props.pageProps.initialState.productDetailContent.pdpProductContent
      if (breadcrumb === null) return
      if (breadcrumb === undefined) return
      if (Object.keys(breadcrumb).length == 0) return
      
      let arraysOfCategory = breadcrumb.map((pro) => pro.product_type !== undefined && pro.product_type?.replace(/\s/g, ''))
      document.querySelectorAll('.inc_recs_block').forEach((prod) => prod.setAttribute('data-client-cat', arraysOfCategory))
      let allProductShowcase = document.querySelectorAll('.inc_recs_block .inc_product_showcase_block')
      // console.log("CATEGORIES FROM CLIENT",arraysOfCategory)
      let clicked = false
      allProductShowcase.forEach((product) => {
        clicked = false
        if (!product.getAttribute('data-cat')) return
        let attributes = product.getAttribute('data-cat').split(',')
        if (attributes.length !== 0) {
          product.querySelectorAll('.inc_hide_attribute button').forEach((button) => {
            if (clicked == false) {
              const buttonText = button.innerText.replace(/\s/g, '');
              if (arraysOfCategory.includes(buttonText)) {
                button.click()
                clicked = true
              }
            }
          });
          product.querySelectorAll('.inc_attribute_hide button').forEach((button) => {
            if (clicked == false) {
              const buttonText = button.innerText.replace(/\s/g, '');
              if (arraysOfCategory.includes(buttonText)) {
                button.click()
                clicked = true
              }
            }
          });
        }
      });
    }
  }
  return (
    <>
      {bundlesExist && <FBT bundles={bundles} />}
      {sidebarOpen && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} toggleDrawer={toggleDrawer} />}
    </>
  );
}

export default ProductPage;