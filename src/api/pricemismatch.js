import {
  countryByName, getURLBasedCountryCode,
} from '@/lib/helpers';
import crawlscript from './crawl';

// Price Mismatch API
function incPriceMismatch() {
  let startCheck = true;
  const clientATC = document.querySelector('.productDetailContainer_product-filter-wrapper___kJ9O');
  const clientATC2 = document.querySelector('button[data-testid="pdc-btn-notifyme"]');
  if (clientATC) {
    if (clientATC.innerText === 'Notify Me') {
      startCheck = false;
    }
  } if (clientATC2) {
    if (clientATC2.innerText === 'Notify Me') {
      startCheck = false;
    }
  }

  let data = {};
  const priceMismatchObj = {};
  priceMismatchObj.token = getURLBasedCountryCode();
  let activeID = document.querySelector('div[data-main-product=true].inc_product_showcase_block').getAttribute('data-activeid');
  if (activeID === null) {
    activeID = document.querySelector('div[data-main-product=true].inc_product_showcase_block').getAttribute('data-productID');
  }
  priceMismatchObj.product_id = activeID;

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
  priceMismatchObj.product_price = clientActivePrice;
  priceMismatchObj.special_price = clientSpecialPrice;

  let ourActive = null;
  let ourSpecial = null;

  if (document.querySelector('div[data-main-product=true] .inc_product_info_main_block .inc_product_active_regular_block.single')) {
    ourActive = document.querySelector('div[data-main-product=true] .inc_product_info_main_block .inc_product_active_regular_block.single').innerText.replace(/^\D+/g, '').toString();
    priceMismatchObj.old_product_price = ourActive.replace(',', '');
    priceMismatchObj.old_special_price = ourSpecial;
  } else {
    const ourPriceElement = document.querySelector('.inc_pdp_block div[data-main-product=true] .inc_product_desc_price_block');
    const regularPrice = ourPriceElement.querySelector('.inc_product_active_price_block.strikethrough');
    const specialPrice = ourPriceElement.querySelector('.inc_product_active_regular_block');
    ourActive = regularPrice.innerText.replace(/^\D+/g, '').replace(',', '').toString();
    ourSpecial = specialPrice.innerText.replace(/^\D+/g, '').replace(',', '').toString();
    priceMismatchObj.old_product_price = ourActive;
    priceMismatchObj.old_special_price = ourSpecial;
  }

  priceMismatchObj.price_type = 'IncVAT';

  // console.log(priceMismatchObj);
  if (startCheck === false) {
    if (priceMismatchObj.token === 'b58leuro') {
      crawlscript(priceMismatchObj);
    }
  }
  if (startCheck === false) return;

  data = {
    eventData: btoa(JSON.stringify(priceMismatchObj)),
  };

  let mismatch = false;

  if (Number(priceMismatchObj.product_price) !== Number(priceMismatchObj.old_product_price) || Number(priceMismatchObj.special_price) !== Number(priceMismatchObj.old_special_price)) {
    mismatch = true;
  }

  let mismatchURL = 'https://gather.increasingly.com/ProductPriceDetails';
  if (countryByName() === 'United States') {
    mismatchURL = 'https://usagather.increasingly.com/ProductPriceDetails';
  }
  if (countryByName() === 'Australia') {
    mismatchURL = 'https://jpgather.increasingly.com/ProductPriceDetails';
  }

  
  if (mismatch) {
    // fetch(mismatchURL, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application.json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    //   cache: 'default',
    // });
    // document.querySelector('.inc_pdp_block').style.display = 'none';
    return true;
  }
  document.querySelector('.inc_pdp_block').style.display = 'block';
  if (priceMismatchObj.token === 'b58leuro') {
    crawlscript(priceMismatchObj);
  }
  return false;
}
export default incPriceMismatch;
