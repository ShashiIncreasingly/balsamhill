/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
/* eslint-disable quote-props */
/* eslint-disable no-shadow */
import { clientConfig } from '../zustand/store';

export function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
export const currencyCheck = () => {
  let currency = 'EUR';
  let priceCheck1 = document.querySelector('.productPrice_new-price__tLgIi');
  if (priceCheck1) {
    if (priceCheck1.textContent.includes('£')) {
      currency = 'GBP';
    }
  } else if (localStorage.getItem('selectedCurrency')) {
    let parsed = JSON.parse(localStorage.getItem('selectedCurrency'));
    currency = parsed.isocode;
  } else if (document.querySelector('script[data-sdk-integration-source="react-paypal-js"]')) {
    if (
      document
        .querySelector('script[data-sdk-integration-source="react-paypal-js"]')
        .src.includes('GBP')
    ) {
      currency = 'GBP';
    }
  }
  return currency;
};

export const getCountryCode = () => {
  if (window.location.host === 'uat-ui.i.balsamhill.co.uk') {
    return 'b17s0mReQ6UK';
  }
  if (window.location.host === 'uat-ui.i.balsamhill.com.au') {
    return 'b17s0mReQ6AU';
  }
  if (window.location.host === 'uat-ui.i.balsamhill.com') {
    return 'b17s0mReQ6';
  }
  if (window.location.host === 'uat-ui.i.balsamhill.ca') {
    return 'b17s0mReQ6CA';
  }
  return 'b17s0mReQ6';
};

export const sortArray = (array) => {
  let sorting = null;
  if (countryByName() === 'United States' || countryByName() === 'Canada') {
    sorting = [
      'Wildcard 1',
      'Wildcard 2',
      'Wildcard 3',
      'Wildcard 4',
      'empty_header_0',
      'empty_header_1',
      'empty_header_2',
      'Foliage Type',
      'Color_size',
      'Leather',
      'Castors',
      'Size_',
      'Design',
    
      'Height',
      'Type',
      'Diameter',
      'Candle Type',
      'Amount',
      'Shape',
      'Colour',
      'Color',
      'Size',
      'Size_',
      'Set Size',
      'Lights',
      'Length',
      'Width',
      'Light Type',
      'spec_width',
      'Scent',
    ];
  } else {
    sorting = [
      'Wildcard 1',
      'Wildcard 2',
      'Wildcard 3',
      'Wildcard 4',
      'empty_header_0',
      'empty_header_1',
      'empty_header_2',
      'Foliage Type',
      'Color_size',
      'Leather',
      'Castors',
      'Size_',
      'Candle Type',
      'Amount',
      'Height',
      'Type',
      'Shape',
      'Color',
      'Colour',
      'Size',
      'Size_',
      'Set Size',
      'Design',
      'Lights',
      'Diameter',
      'Length',
      'Width',
      'Light Type',
      'spec_width',
      'Scent',
    ];
  }

  if (countryByName() === 'United States' || countryByName() === 'Canada') {
    const array6 = ['Color', 'Set Size'];
    let find6 = 0;
    array.forEach((item) => array6.includes(item.attributeCode) && find6++);
    if (find6 === 2) {
      sorting = [
        'Wildcard 1',
        'Wildcard 2',
        'Wildcard 3',
        'Wildcard 4',
        'empty_header_0',
        'empty_header_1',
        'empty_header_2',
        'Foliage Type',
        'Color_size',
        'Size',
        'Size_',
        'Leather',
        'Castors',
        'Size_',
        'Amount',
        'Height',
        'Set Size',
        'Shape',
        'Color',
        'Colour',
        'Diameter',
        'Length',
        'Width',
        'Light Type',
        'spec_width',
        'Type',
        'Scent',
      ];
    }
  }
  // height - lenght - width - diameter - color - set size - height

  // Let comb1 = color set size height
  if (countryByName() === 'United Kingdom' || countryByName() === 'Australia') {
    let find1 = 0;
    const array1 = ['Set Size', 'Colour', 'Height'];
    array.forEach((item) => array1.includes(item.attributeCode) && find1++);

    if (find1 == 3) {
      sorting = [
        'Wildcard 1',
        'Wildcard 2',
        'Wildcard 3',
        'Wildcard 4',
        'empty_header_0',
        'empty_header_1',
        'empty_header_2',
        'Foliage Type',
        'Color_size',
        'Shape',
        'Size',
        'Size_',
        'Color',
        'Colour',
        'Leather',
        'Castors',
        'Size_',
        'Amount',
        'Height',
        'Set Size',
        'Diameter',
        'Length',
        'Width',
        'Light Type',
        'spec_width',
        'Type',
      ];
    }

    // Let comb1 = Height Diamter
    let find2 = 0;
    const array2 = ['Height', 'Diameter'];
    array.forEach((item) => array2.includes(item.attributeCode) && find2++);

    if (find2 == 2) {
      sorting = [
        'Wildcard 1',
        'Wildcard 2',
        'Wildcard 3',
        'Wildcard 4',
        'empty_header_0',
        'empty_header_1',
        'empty_header_2',
        'Foliage Type',
        'Color_size',
        'Size',
        'Size_',
        'Leather',
        'Castors',
        'Size_',
        'Amount',
        'Set Size',
        'Shape',
        'Color',
        'Colour',
        'Type',
        'Height',
        'Diameter',
        'Length',
        'Width',
        'Light Type',
        'spec_width'
      ];
    }

    // Let comb1 = Diamter COlor
    let find3 = 0;
    const array3 = ['Colour', 'Diameter'];
    array.forEach((item) => array3.includes(item.attributeCode) && find3++);

    if (find3 == 2) {
      sorting = [
        'Wildcard 1',
        'Wildcard 2',
        'Wildcard 3',
        'Wildcard 4',
        'empty_header_0',
        'empty_header_1',
        'empty_header_2',
        'Foliage Type',
        'Color_size',
        'Size',
        'Size_',
        'Leather',
        'Castors',
        'Size_',
        'Diameter',
        'Amount',
        'Set Size',
        'Shape',
        'Color',
        'Colour',
        'Type',
        'Height',
        'Length',
        'Width',
        'Light Type',
        'spec_width'
      ];
    }
  }

  const hidden = ['spec_width'];
  const result = [];
  sorting.map((key) => {
    if (!hidden.includes(key)) {
      const post = array.filter((item) => item.frontEndLabel == key)[0];
      if (post) {
        result.push(post);
      }
    }
  });
  return result;
};

export const checkPreviewMode = () => {
  let recsload = false;
  if (typeof LOAD_INCREASINGLY !== 'undefined') {
    if (LOAD_INCREASINGLY === true) {
      recsload = true;
    }
  } else {
    recsload = true;
  }
  return recsload;
};

export const readCookieValue = (name) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (const s in ca) {
    if (Object.prototype.hasOwnProperty.call(ca, s)) {
      let c = ca[s];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
  }
  return null;
}; // IRB Req (PDP)

export const getURLBasedCountryCode = () => {
  function readIVID(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (const s in ca) {
      if (Object.prototype.hasOwnProperty.call(ca, s)) {
        let c = ca[s];
        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
          return c.substring(nameEQ.length, c.length);
        }
      }
    }
    return null;
  }

  function currencyCheck() {
    let currency = 'EUR'; // Default currency
    const priceCheck1 = document.querySelector('.productPrice_new-price__tLgIi');
    const selectedCurrency = localStorage.getItem('selectedCurrency');
    const paypalScript = document.querySelector('script[data-sdk-integration-source="react-paypal-js"]');
    const productSalePrice = document.querySelector('.productCard_prod-sale-price__KB_Tq');
  
    if (priceCheck1 && priceCheck1.textContent.includes('£')) {
      currency = 'GBP';
    } else if (selectedCurrency) {
      try {
        const parsed = JSON.parse(selectedCurrency);
        currency = parsed.isocode || 'EUR';
      } catch (error) {
        console.error('Error parsing selectedCurrency from localStorage:', error);
      }
    } else if (paypalScript && paypalScript.src.includes('GBP')) {
      currency = 'GBP';
    } else if (productSalePrice && productSalePrice.textContent.includes('£')) {
      currency = 'GBP';
    }
    return currency;
  }
  if (window.location.host === 'prod-ui.i.balsamhill.co.uk' && readIVID('ivid') === 'aee9ce1aaeeb8e13719b8e130e0b96170e0f0d74fb') {
    let value = 'b1Al5UmUK';

    if (currencyCheck() === 'EUR') {
      value = 'bALwe2Re';
    }

    return value;
  }
  if (window.location.host === 'www.balsamhill.co.uk') {
    let value = 'b58luk';

    if (currencyCheck() === 'EUR') {
      value = 'b58leuro';
    }

    return value;
  }
  if (window.location.host === 'www.balsamhill.com') {
    return 'b58lus';
  }
  if (window.location.host === 'www.balsamhill.com.au') {
    return 'b58lau';
  }
  if (window.location.host === 'www.balsamhill.ca') {
    return 'b58lca';
  }

  if (window.location.host === 'uat-ui.i.balsamhill.co.uk') {
    let value = 'b17s0mReQ6UK';

    if (currencyCheck() === 'EUR') {
      value = 'b15eUroUK';
    }

    return value;
  }
  if (window.location.host === 'uat-ui.i.balsamhill.com.au') {
    return 'b17s0mReQ6AU';
  }
  if (window.location.host === 'uat-ui.i.balsamhill.com') {
    return 'b17s0mReQ6';
  }
  if (window.location.host === 'uat-ui.i.balsamhill.ca') {
    return 'b17s0mReQ6CA';
  }

  return 'b17s0mReQ6';
};

export const getCurrencyCode = () => {
  if (getURLBasedCountryCode() === 'b17s0mReQ6AU') {
    return 'USD';
  }
  if (getURLBasedCountryCode() === 'b15eUroUK') {
    return 'EUR';
  }
  if (getURLBasedCountryCode() === 'b17s0mReQ6UK') {
    return 'GBP';
  }
  if (getURLBasedCountryCode() === 'b17s0mReQ6') {
    return 'USD';
  }
  if (getURLBasedCountryCode() === 'bALwe2Re') {
    return 'EUR';
  }

  if (getURLBasedCountryCode() === 'b1Al5UmUK') {
    return 'GBP';
  }
  if (getURLBasedCountryCode() === 'b1Al5UmUS') {
    return 'USD';
  }
  if (getURLBasedCountryCode() === 'b1Al5UmAU') {
    return 'USD';
  }

  // LIVE

  if (getURLBasedCountryCode() === 'b58luk') {
    return 'GBP';
  }
  if (getURLBasedCountryCode() === 'b58leuro') {
    return 'EUR';
  }
  if (getURLBasedCountryCode() === 'b58lus') {
    return 'USD';
  }
  if (getURLBasedCountryCode() === 'b58lau') {
    return 'USD';
  }
  if (getURLBasedCountryCode() === 'b58lca' || getURLBasedCountryCode() === 'b17s0mReQ6CA') {
    return 'USD';
  }
  return 'GBP';
};

export const countryByName = () => {
  const countryCode = getURLBasedCountryCode();

  const countryMap = {
    'b17s0mReQ6AU': 'Australia',
    'b15eUroUK': 'United Kingdom',
    'b17s0mReQ6UK': 'United Kingdom',
    'b17s0mReQ6': 'United States',
    'bALwe2Re': 'United Kingdom',
    'b1Al5UmUK': 'United Kingdom',
    'b1Al5UmUS': 'United States',
    'b1Al5UmAU': 'Australia',
    'b58luk': 'United Kingdom',
    'b58leuro': 'United Kingdom',
    'b58lus': 'United States',
    'b58lau': 'Australia',
    'b58lca': 'Canada',
    'b17s0mReQ6CA': 'Canada',
  };

  return countryMap[countryCode] || null; // Return country or null if code doesn't exist
};

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: getCurrencyCode(),
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const getProductIdFromWebPage = () => {
  let PRODUCTID = null;
  const allClientScript = document.querySelectorAll('script[type="application/ld+json"]');
  allClientScript.forEach((element) => {
    const parsedJSON = JSON.parse(element.innerText);
    if (parsedJSON.hasVariant) {
      const familifyVariants = parsedJSON.hasVariant;
      for (const variants_ of familifyVariants) {
        let skuFromURL = window.location.href.split('sku=')[1]?.split('&')[0]?.split('#')[0];
        if (variants_?.offers?.url?.includes(selectedItemId)) {
          if (variants_.sku !== undefined){
            PRODUCTID = variants_.sku;
            break; 
          } else if (variants_.mpn !== undefined){
            PRODUCTID = variants_.mpn;
            break; 
          }
        }
      }
    }
  });

  for (let p = 0; p <= window.dataLayer.length; p++){
    if(window.dataLayer[p]){
      if (window.dataLayer[p].event == 'product_view'){
        if (window.dataLayer[p].sku){
            let isNumericId = /^-?\d+(\.\d+)?$/.test(window.dataLayer[p].sku);
            if(!isNumericId){
              PRODUCTID = window.dataLayer[p].sku
            }
        }
      }
    }
  }
  console.log('PRODUCTID', PRODUCTID);
  return PRODUCTID;
};
export const fireCartAPI = async () => {
  let authType = 'hybrisToken';
  let responseData = null;
  function getCartId() {
    let cartId = localStorage.getItem('cartId');
    if (cartId !== null) {
      cartId = cartId.replaceAll('"', '');
    } else {
      cartId = 'none';
    }
    if (cartId == '') {
      cartId = 'none';
    }
    return cartId;
  }

  let loggedIn = false;
  if (localStorage.getItem('inc_isln') == 'true') {
    loggedIn = true;
    authType = 'hybrisAuth';
  }

  const API_URL = '/api/auth/session';
  async function fetchUsers() {
    const response = await fetch(API_URL);
    const users = await response.json();
    return users;
  }

  await fetchUsers().then(async (data) => {
    if (Object.keys(data).length !== 0) {
      if (data.isUserLoggedIn) {
        loggedIn = true;
        localStorage.setItem('inc_isln', true);
        authType = 'hybrisAuth';
      } else {
        localStorage.setItem('inc_isln', false);
        authType = 'hybrisToken';
      }
    } else {
      localStorage.setItem('inc_isln', false);
      authType = 'hybrisToken';
    }

    let loggParam = loggedIn ? 'current' : 'anonymous';

    const isASMSession = checkForAsmUrlEnable();

    if (isASMSession) {
      const asmUserType = getUserType();
      if (asmUserType !== null) {
        loggParam = asmUserType;
      }
    }

    const getURL = () => {
      const origin = window.location.origin;
      const cartId = getCartId();

      switch (origin) {
        case 'https://uat-ui.i.balsamhill.com.au':
        case 'https://www.balsamhill.com.au':
          return `/api/${authType}/bh-au/users/${loggParam}/carts/${cartId}?fields=FULL&curr=AUD`;
        case 'https://uat-ui.i.balsamhill.co.uk':
        case 'https://www.balsamhill.co.uk':
          return `/api/${authType}/bh-uk/users/${loggParam}/carts/${cartId}?fields=FULL&curr=${currencyCheck() === 'EUR' ? 'EUR' : 'GBP'}`;
        case 'https://uat-ui.i.balsamhill.com':
        case 'https://www.balsamhill.com':
          return `/api/${authType}/bh-us/users/${loggParam}/carts/${cartId}?fields=FULL&curr=USD`;
        case 'https://uat-ui.i.balsamhill.ca':
        case 'https://www.balsamhill.ca':
          return `/api/${authType}/bh-ca/users/${loggParam}/carts/${cartId}?fields=FULL&curr=CAD`;
        default:
          throw new Error('Unknown origin');
      }
    };

    const cartId = getCartId();
    if (cartId === 'none') return;
    const response = await fetch(getURL(), {
      method: 'GET',
    });
    const responseAPIData = await response.json();
    responseData = responseAPIData
    return responseAPIData;
  });

  return responseData;
};

export const getCartPageProductIds = async (env) => {
  const PRODUCTIDS = [];
  try {
    const products = await fireCartAPI();
    if (products && products.entries) {
      products.entries.forEach((item) => {
        PRODUCTIDS.push(item.product.baseProduct);
      });
    }
  } catch (error) {
    console.log('Error fetching cart data:', error);
  }
  return PRODUCTIDS;
};


export function decodeEntity(inputStr) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = inputStr;
  let { value } = textarea;

  if (value.includes('empty')) {
    for (let i = 0; i <= 10; i += 1) {
      const pattern = `_empty_header_0${i}`;
      value = value.replace(pattern.toString(), '');
      if (!value.includes('empty')) {
        break;
      }
    }
  }

  function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi, (match) =>
      String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    );
  }

  value = unicodeToChar(value);

  value = value.replace(/\\/g, '');
  return value;
}

// Custom Functions Specific For Client
export const convertSetAttribute = (attributes) => {
  const allAttributeNames = attributes.map((child) => child.attributeCode);
  const attributeGroups = [
    ['empty_header', 'empty_header_0', 'empty_header_1', 'empty_header_2'],
    ['Wildcard 1', 'Wildcard 2', 'Wildcard 3', 'Wildcard 4'],
    ['Diameter'],
    ['Set Size'],
    ['Height', 'Length', 'Width'],
    ['Color', 'Length', 'Width'],
    ['Height', 'Width'],
    ['Length', 'Width'],
  ];

  // Loop through each group to check if all items exist in `allAttributeNames`
  for (const group of attributeGroups) {
    if (group.every((attr) => allAttributeNames.includes(attr))) {
      return true;
    }
  }

  return false;
};
export const getCheckoutLinkClient = () => {
  const countryElement = document.querySelector('[class*=bCountrySelector_currency-dropdown]');
  if (countryElement) {
    if (countryElement.innerText === 'United Kingdom') {
      return '/cart';
    }
    if (countryElement.innerText === 'Australia') {
      return '/cart';
    }
    if (countryElement.innerText === 'United States') {
      return '/cart';
    }
    if (countryElement.innerText === 'Canada') {
      return '/cart';
    }
  }
  return '/cart';
};

export const getAddToCartURLClient = () => {
  const countryElement = document.querySelector('[class*=bCountrySelector_currency-dropdown]');
  if (countryElement) {
    if (countryElement.innerText === 'United Kingdom') {
      return '/api/addProductToCart/bh-uk/users/anonymous/carts/b01eff11-4ae5-4650-be8f-a494ba3a28c6/entries?fields=FULL&curr=GBP';
    }
    if (countryElement.innerText === 'Australia') {
      return '/api/addProductToCart/bh-au/users/anonymous/carts/none/entries?curr=AUD';
    }
    if (countryElement.innerText === 'United States') {
      return '/api/addProductToCart/bh-us/users/anonymous/carts/7ff4adfe-c826-496d-baf1-c9ceb1a43a86/entries?fields=FULL&curr=USD';
    }
    if (countryElement.innerText === 'Canada') {
      return '/api/addProductToCart/bh-ca/users/anonymous/carts/33e6b99c-2228-41fd-bede-691ec849b56d/entries?fields=FULL&curr=CAD';
    }
    return '/api/addProductToCart/bh-us/users/anonymous/carts/7ff4adfe-c826-496d-baf1-c9ceb1a43a86/entries?fields=FULL&curr=USD';
  }
  return false;
};

export const Base64 = {
  encode(e) {
    return window.btoa(e);
  },
  decode(e) {
    return window.atoa(e);
  }
};

export const handleFallbackImage = (e) => {
  e.target.src = clientConfig.no_image;
};

export const getPageType = () => {
  if (window.location.pathname === '/') {
    return 'HomePage';
  }
  if (window.location.pathname === '/cart') {
    return 'CartPage';
  }
  if (window.location.pathname.includes('/p/')) {
    return 'PDP';
  }
  if (window.location.pathname.includes('/f/')) {
    return 'PDP';
  }
  if (window.location.pathname.includes('/c/')) {
    return 'ProductList';
  }
  if (window.location.pathname.includes('/search')) {
    return 'SearchPage';
  }
  if (
    window.location.pathname.includes(
      '/artificial-christmas-trees-wreaths-garlands-foliage-home-decor-on-sale'
    )
  ) {
    return 'ContentPage';
  }

  return 'Invalid Page';
};

export const generateRandomString = (bits1) =>
  (crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295).toString(bits1).substring(2, 15) +
  (crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295).toString(bits1).substring(2, 15);

export const addVisitorID = () => {
  function generateUniqueINCVisitorId(len, bits) {
    const bits1 = bits || 36;
    let outStr = '';
    let newStr;
    while (outStr.length < len) {
      newStr = generateRandomString(bits1).toString().slice(2);
      outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length));
    }
    return outStr;
  }
  let ivid = '';
  if (readCookieValue('ivid') != undefined) {
    ivid = readCookieValue('ivid');
  }
  let clientdomain = window.location.host;
  const arr = clientdomain.split('.');
  const d = new Date();
  let expires = `expires=${d.toUTCString()}`;
  if (ivid.length === 0) {
    ivid = generateUniqueINCVisitorId(42, 16);
    arr.shift();
    clientdomain = arr.join('.');
    if (arr === 'com') {
      clientdomain = window.location.host;
    }
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    expires = `expires=${d.toUTCString()}`;
    document.cookie = `ivid=${ivid};expires=${expires};domain=${clientdomain};path=/` + ';secure;';
  } else {
    arr.shift();
    clientdomain = arr.join('.');
    if (arr === 'com') {
      clientdomain = window.location.host;
    }
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    expires = `expires=${d.toUTCString()}`;
    document.cookie = `ivid=${ivid};expires=${expires};domain=${clientdomain};path=/` + ';secure;';
  }

  return ivid;
};

export const getCurrentFormattedTime = () => {
  const d = new Date();
  return `${d.getFullYear()}-${
    d.getMonth() + 1
  }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`;
};

export const getRecsButton = () => {
  if (countryByName() == 'Australia') {
    return 'Add to Cart';
  }
  if (countryByName() == 'United Kingdom') {
    return 'Add to Basket';
  }
  return 'Add to Cart';
};

export const getCartButton = () => {
  if (countryByName() == 'Australia') {
    return 'Cart';
  }
  if (countryByName() == 'United Kingdom') {
    return 'Basket';
  }
  return 'Cart';
};

export const parseHTML = (htmlString) => {
  const domParser = new DOMParser();
  const htmlDom = domParser.parseFromString(htmlString, 'text/html');
  const readMore = htmlDom.querySelector('[ng-click]');
  if (readMore) {
    htmlDom.querySelector('[ng-click]').remove();
  }
  const stringifiedHtml = htmlDom.querySelector('html').innerHTML;
  return stringifiedHtml;
};

export const getCartId = () => {
  if (localStorage.getItem('cartId') === 'null') {
    // localStorage.removeItem('cartId');
  }
};

export const getPageTypeName = () => {
  if (window.location.pathname === '/') {
    return 'HomePage';
  }
  if (window.location.pathname === '/cart') {
    return 'CartPage';
  }
  if (window.location.pathname.includes('/p/')) {
    return 'ProductPage';
  }
  if (window.location.pathname.includes('/f/')) {
    return 'ProductPage';
  }
  if (window.location.pathname.includes('/c/')) {
    return 'ProductList';
  }
  if (window.location.pathname.includes('/search')) {
    return 'SearchPage';
  }
  if (
    window.location.pathname.includes(
      '/artificial-christmas-trees-wreaths-garlands-foliage-home-decor-on-sale'
    )
  ) {
    return 'ContentPage';
  }
  return false;
};

export const trackingScopes = [
  {
    pageType: 'HomePage',
    pageNumber: 111,
    'Best Sellers': 1,
    'Most Popular Trees': 2,
    'New Arrivals': 3
  },
  {
    pageType: 'ProductList',
    pageNumber: 112,
    'Most Popular': 4,
    'You Might Also Like': 5,
    'Best Sellers on Sale': 4
  },
  {
    pageType: 'SearchPage',
    pageNumber: 113,
    'Most Popular': 6,
    'You Might Also Like': 7,
    'Best Sellers': 6,
    'You May Also Like': 7
  },
  {
    pageType: 'NullSearch',
    pageNumber: 114,
    'Most Popular': 8,
    'You Might Also Like': 9,
    'Best Sellers': 8,
    'You May Also Like': 9
  },
  {
    pageType: 'ProductPage',
    pageNumber: 100,
    'Explore Similar Items': 10,
    'Best-Selling Similar Products': 10,
    'More to Discover': 12
  },
  {
    pageType: 'CartPage',
    pageNumber: 103,
    'Frequently Bought Together': 13,
    'You Might Also Like': 14,
    'Best-Selling Similar Products': 14
  },
  {
    pageType: 'EmptyCart',
    pageNumber: 115,
    'Best Sellers': 15,
    'You Might Also Like': 16,
    'You May Also Like': 16
  },
  {
    pageType: 'ContentPage',
    pageNumber: 116,
    'More to Discover': 17,
    'Best Sellers': 18,
    'Chosen For You': 19,
    'Recommended For You': 19
  }
];

export const checkForAsmUrlEnable = () => {
  // Return if actual asm session is present which is not expired
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const isAsmSessionExpire =
      localStorage.getItem('asmAgentSessionExpireTime') > Date.now() ? false : true;

    if ((params && params?.get('asm') === 'true') || !isAsmSessionExpire) return true;
  }
  return false;
};

export const getUserType = () => {
  let output = 'anonymous';
  let storageWithASM = localStorage.getItem('asmImpersonatedUser');
  if (storageWithASM !== null) {
    if (localStorage.getItem('asmImpersonatedUser') == '"anonymous"') {
      output = 'anonymous';
    } else if (localStorage.getItem('asmImpersonatedUser') == '"current"') {
      output = 'current';
    } else if (localStorage.getItem('asmImpersonatedUser') == 'current') {
      output = 'current';
    } else {
      let parse = JSON.parse(localStorage.getItem('asmImpersonatedUser'));
      output = parse.customerId;
    }
  }
  let checkASMLoggedInAs = localStorage.getItem('asmAgentLoggedInAs');
  if (checkASMLoggedInAs !== '"asagent"') {
    output = 'anonymous';
  }
  return output;
};

export const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const numberToWords = (number) => {
  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = [
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen'
  ];
  const tens = [
    '',
    'ten',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety'
  ];

  if (number === 0) {
    return 'zero';
  }

  if (number < 10) {
    return units[number];
  }

  if (number >= 11 && number <= 19) {
    return teens[number - 11];
  }

  const digit1 = number % 10;
  const digit10 = Math.floor(number / 10);

  return tens[digit10] + (digit1 !== 0 ? ' ' + units[digit1] : '');
};
