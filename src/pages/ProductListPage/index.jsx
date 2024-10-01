import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { irbPLPBestSeller, irbPLPCollection } from '@/api/irb';
import { readCookieValue } from '@/lib/helpers';
import useStore from '@/zustand/store';
import intersectionWith from 'lodash/intersectionWith'

import Sidebar from '@/components/sidebar';
import MostPopular from './modules/MostPopular';
import YouMightAlsoLike from './modules/YouMightAlsoLike';
import categoryCrawl from '@/api/crawlplp';

function RenderNewArrivals() {
  const clientElement = document.querySelector('#inc_plp_2');
  if (!clientElement) return
  const root = ReactDOM.createRoot(clientElement);
  const previousSibling = document.querySelector('#inc_plp_2').parentElement.previousElementSibling;
  const nextSibling = document.querySelector('#inc_plp_2').parentElement.nextElementSibling;
  if (nextSibling) {
    nextSibling.style.display = 'none';
  }

  // Rendering New Arrivals
  root.render(
    <React.StrictMode>
      <YouMightAlsoLike />
    </React.StrictMode>,
  );
}

function ProductList() {
  const fetchBundle = useStore((store) => store.fetchBundle);
  const MostPopularExist = useStore((store) => store.MostPopularExist);
  const bestSellers30DExist = useStore((store) => store.bestSellers30DExist);
  const sidebarOpen = useStore((store) => store.sidebarOpen);
  const handleSidebar = useStore((store) => store.handleSidebar);
  const [isOpen, setIsOpen] = React.useState(false);
  const makeCartEmpty = useStore((store) => store.makeCartEmpty);

  useEffect(() => {
    const ivid = readCookieValue('ivid');
    const MOST_POPULAR_URL = window.location.href.includes('balsam') ? irbPLPCollection(ivid) : 'development';
    const BEST_SELLER_30D = window.location.href.includes('balsam') ? irbPLPBestSeller(ivid, 'Best Sellers 30D') : 'development';

    if (document.querySelector('#inc_plp_1')) {
      fetchBundle(MOST_POPULAR_URL, 'Most Popular');
    }
    fetchBundle(BEST_SELLER_30D, 'Best Sellers 30D');
    // categoryCrawl();
  }, []);

  const toggleDrawer = () => {
    makeCartEmpty();
    setIsOpen((prevState) => !prevState);
    setTimeout(() => {
      handleSidebar(false);
    }, 100);
  };

  useEffect(() => {
    // console.log('BEST SELLER', bestSellers30DExist);
    if (bestSellers30DExist) {
      RenderNewArrivals();
    }
  }, [bestSellers30DExist]);

  useEffect(() => {
    if (sidebarOpen) {
      setIsOpen(true);
    }
  }, [sidebarOpen]);

 


  useEffect(() => {
    setTimeout(() => {
      matchRecsCategory()
    }, 2000);
  }, [])


  function matchRecsCategory() {

    if (window.location.pathname.includes('/c/')) {
      let breadcrumb = ""
      if (JSON.parse(document.querySelector('#__NEXT_DATA__').innerText).props.pageProps.plpProducts) {
        breadcrumb = JSON.parse(document.querySelector('#__NEXT_DATA__').innerText).props.pageProps.plpProducts.products
      } else {
        breadcrumb = JSON.parse(document.querySelector('#__NEXT_DATA__').innerText).props.pageProps.initialState.productCategory.productListingDetailsSSR.products
      }
      if (breadcrumb == undefined) {

        // console.log("Product ")
        return
      }

      if (breadcrumb == undefined) return

      let arraysOfCategory = breadcrumb.map((pro) => pro.productType !== undefined && pro.productType?.replace(/\s/g, ''))
      document.querySelectorAll('.inc_recs_block').forEach((prod) => prod.setAttribute('data-client-cat', arraysOfCategory))
      let allProductShowcase = document.querySelectorAll('.inc_product_showcase_block')

      // console.log("CATEGORIES FROM CLIENT",arraysOfCategory)
      let clicked = false;
      allProductShowcase.forEach((product) => {
        clicked = false;
        let attributes = product.getAttribute('data-cat').split(',');
        if (attributes.length !== 0) {
          product.querySelectorAll('.inc_hide_attribute button').forEach((button) => {
            if (clicked === false) {
              const buttonText = button.querySelector('.inc_product_modal_combo_attributes').innerText.replace(/\s/g, '');
              if (arraysOfCategory.includes(buttonText)) {
                button.click();
                clicked = true;
              } else {
                let stopChild = false
                arraysOfCategory.forEach((type) => {
                  if (stopChild === false) {

                    if (type !== false) {
                      if (type.includes(buttonText)) {
                        button.click();
                        stopChild = true;
                      } else if (buttonText.includes(type)) {
                        button.click();
                        stopChild = true;
                      }
                    }
                  }
                });
              }
            }
          });
          product.querySelectorAll('.inc_attribute_hide button').forEach((button) => {
            if (clicked === false) {
              const buttonText = button.innerText.replace(/\s/g, '');
              if (arraysOfCategory.includes(buttonText)) {
                button.click();
                clicked = true;
              }
            }
          });
        }
      });
    }
  }

  return (
    <>
      {MostPopularExist && <MostPopular />}
      <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} toggleDrawer={toggleDrawer} />
    </>
  );
}

export default ProductList;
