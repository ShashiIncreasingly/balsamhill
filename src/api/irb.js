import { countryByName, getURLBasedCountryCode } from '../lib/helpers';

function getIRB() {
  const name = countryByName();
  if (name === 'United Kingdom') {
    return 'https://rapidload.increasingly.co/increasingly_bundles?irb/';
  } if (name === 'United States') {
    return 'https://usarapidload.increasingly.co/increasingly_bundles?irb/';
  } if (name === 'Australia') {
    return 'https://jprapidload.increasingly.co/increasingly_bundles?irb/';
  }

  return 'https://usarapidload.increasingly.co/increasingly_bundles?irb/';
}

var Base64 = {

  // private property
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode : function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      input = Base64._utf8_encode(input);

      while (i < input.length) {

          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
              enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
              enc4 = 64;
          }

          output = output +
          this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
          this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
      }
      return output;
  },

  // public method for decoding
  decode : function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {

          enc1 = this._keyStr.indexOf(input.charAt(i++));
          enc2 = this._keyStr.indexOf(input.charAt(i++));
          enc3 = this._keyStr.indexOf(input.charAt(i++));
          enc4 = this._keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
          }
      }

      output = Base64._utf8_decode(output);

      return output;
  },

  // private method for UTF-8 encoding
  _utf8_encode : function (string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

          var c = string.charCodeAt(n);

          if (c < 128) {
              utftext += String.fromCharCode(c);
          }
          else if((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
          }
      }
      return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode : function (utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;

      while ( i < utftext.length ) {

          c = utftext.charCodeAt(i);

          if (c < 128) {
              string += String.fromCharCode(c);
              i++;
          }
          else if((c > 191) && (c < 224)) {
              c2 = utftext.charCodeAt(i+1);
              string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
              i += 2;
          }
          else {
              c2 = utftext.charCodeAt(i+1);
              c3 = utftext.charCodeAt(i+2);
              string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
              i += 3;
          }
      }
      return string;
  }
}

function b64EncodeUnicode(str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return window.btoa(encodeURIComponent(str).replace(
    /%([0-9A-F]{2})/g,
    (match, p1) => String.fromCharCode(`0x${p1}`),
  ));
}



export const irbReq = (productId, apiKey, ivid) => {
  let irbReqParams = '';
  const irbPATH = getIRB();
  irbReqParams = `product_ids=${productId}&category_id=&api_key=${getURLBasedCountryCode()}&page_type=catalog_product_view&fr=1&client_visitor_id=${ivid}`;
  const irbReqURL = decodeURI(irbPATH + b64EncodeUnicode(irbReqParams));
  return irbReqURL;
};

export const irbReqCart = (productIds, ivid) => {
  let irbReqParams = '';
  const irbPATH = getIRB();
  irbReqParams = `product_ids=${productIds}&category_id=&api_key=${getURLBasedCountryCode()}&page_type=checkout_cart_index&fr=1&client_visitor_id=${ivid}`;
  const irbReqURL = decodeURI(irbPATH + Base64.encode(irbReqParams));
  return irbReqURL;
};

export const irbReqRecommendation = (productId, ivid, mvpT) => {
  let irbReqParams = '';
  const irbPATH = getIRB();

  if (getURLBasedCountryCode() === 'b17s0mReQ6AU' || getURLBasedCountryCode() === 'b17s0mReQ6UK') {
    irbReqParams = `product_ids=${productId}&category_id=&api_key=${getURLBasedCountryCode()}&page_type=catalog_product_view&fr=1&client_visitor_id=${ivid}&rc=1`;
    if (mvpT != null) {
      irbReqParams = `product_ids=${productId}&category_id=&api_key=${getURLBasedCountryCode()}&page_type=catalog_product_view&fr=1&mvp=1&client_visitor_id=${ivid}&rc=1`;
    }
  } else {
    irbReqParams = `product_ids=${productId}&category_id=&api_key=${getURLBasedCountryCode()}&page_type=catalog_product_view&fr=1&mvp=1&client_visitor_id=${ivid}&rc=1`;
  }
  const irbReqURL = decodeURI(irbPATH + Base64.encode(irbReqParams));
  return irbReqURL;
};

export const irbPLPCollection = (ivid) => {
  const productCategory = document.querySelector('.listingContainer_page-title-wrapper__iy_a5 h1').innerText;
  let productId = productCategory.replaceAll(',', '|');
  productId = `${document.querySelector('.breadcrumb .active').innerText}`;
  const irbPATH = getIRB();
  const shoppingType = '2';
  let coded = null
  if (window.location.pathname == "/c/best-selling-artificial-christmas-trees" && countryByName() == "United States") {
    productId = "Best Selling Artificial Christmas Trees"
  }
  if (window.location.pathname === "/c/string-lights-and-lanterns") {
    coded = "U3RyaW5nIExpZ2h0cyBhbmQgTGFudGVybnM="
  }
  if (window.location.pathname === "/c/christmas-ornament-sets") {
    coded = "T3JuYW1lbnRz"
  }
  if (window.location.pathname === "/c/christmas-tree-ornament-sets-and-decorations") {
    coded = "T3JuYW1lbnQgU2V0cw=="
  }

  if (window.location.pathname === "/c/fall-decorative-accents") {
    coded = "RmFsbCBEZWNvcmF0aXZlIEFjY2VudHM="
  }
  if (window.location.pathname === "/c/featured-spring-decor") {
    coded = "U3ByaW5nIENhdGFsb2cgUGlja3M="
  }
  if (window.location.pathname === "/c/christmas-ornaments-storage-and-bags") {
    coded = 'Q2hyaXN0bWFzIG9ybmFtZW50cyBzdG9yYWdlIGFuZCBiYWdz'
  }

  if (window.location.pathname == "/c/new-artificial-christmas-trees" && countryByName() == "United States") {
    coded = "TmV3IEFydGlmaWNpYWwgQ2hyaXN0bWFzIFRyZWVz"
  }
  // &mvp=1
  let irbReqParams = ""
  if (coded === null) {
    irbReqParams = `product_ids=&category_id=${Base64.encode(productId)}&api_key=${getURLBasedCountryCode()}&client_id=&page_type=catalog_category_view&client_visitor_id=${ivid}&npb=${shoppingType}`;
  } else {
    irbReqParams = `product_ids=&category_id=${coded}&api_key=${getURLBasedCountryCode()}&client_id=&page_type=catalog_category_view&client_visitor_id=${ivid}&npb=${shoppingType}`;
  }
  const irbReqURL = decodeURI(irbPATH + Base64.encode(irbReqParams));
  return irbReqURL;
};

export const irbPLPBestSeller = (ivid, categoryId, searchPage) => {
  const productCategory = categoryId;
  const productId = productCategory;
  const irbPATH = getIRB();
  const shoppingType = '2';

  let irbReqParams = `product_ids=&category_id=${Base64.encode(productId)}&api_key=${getURLBasedCountryCode()}&client_id=&page_type=catalog_category_view&client_visitor_id=${ivid}&npb=${shoppingType}`;
  if (window.location.pathname.indexOf('/cart') === -1) {
    // irbReqParams += `&mvp=1`;
  }
  if (searchPage) {
    if (document.querySelector('.emptyItemCard_title__0OY1P')) {
      irbReqParams += '&nullSearch=1';
    } else {
      irbReqParams += '&search=1';
    }
  }
  if (document.querySelector('#inc_empty_cart_1')) {
    irbReqParams += '&emptyCart=1';
    
  }
  if (window.location.pathname.includes('/cart')) {
    irbReqParams += '&rt=12';
  }
 
  const irbReqURL = decodeURI(irbPATH + Base64.encode(irbReqParams));
  return irbReqURL;
};

export const irbRecommendation = (ivid, categoryId, cotentPage, mvpC) => {
  const productId = categoryId;
  const irbPATH = getIRB();
  const shoppingType = '2';
  let irbReqParams = '';

  irbReqParams = `product_ids=&category_id=${Base64.encode(productId)}&api_key=${getURLBasedCountryCode()}&client_id=&page_type=catalog_category_view&client_visitor_id=${ivid}&npb=${shoppingType}`;
  if (mvpC === true) {
    irbReqParams = `product_ids=&category_id=${Base64.encode(productId)}&api_key=${getURLBasedCountryCode()}&client_id=&page_type=catalog_category_view&mvp=1&client_visitor_id=${ivid}&npb=${shoppingType}`;
  }
  if (window.location.pathname === '/') {
    irbReqParams += '&home=1';
  }
  if (window.location.pathname.includes('/artificial-christmas-trees-wreaths-garlands-foliage-home-decor-on-sale')) {
    irbReqParams += '&content=1';
  }
  const irbReqURL = decodeURI(irbPATH + Base64.encode(irbReqParams));
  return irbReqURL;
};

export const irbHomeCollection = (ivid, categoryId) => {
  const productId = categoryId;
  const irbPATH = getIRB();
  const shoppingType = '2';

  let irbReqParams = `product_ids=&category_id=${Base64.encode(productId)}&api_key=${getURLBasedCountryCode()}&client_id=&page_type=catalog_category_view&client_visitor_id=${ivid}&npb=${shoppingType}`;
  if (window.location.pathname === '/') {
    irbReqParams += '&home=1';
  }
  if (window.location.pathname.includes('/artificial-christmas-trees-wreaths-garlands-foliage-home-decor-on-sale')) {
    irbReqParams += '&content=1';
  }
  const irbReqURL = decodeURI(irbPATH + Base64.encode(irbReqParams));
  return irbReqURL;
};

export const irbSiteWideBestSeller = (ivid, categoryId) => {
  const productId = categoryId;
  const irbPATH = getIRB();
  const shoppingType = '2';
  const irbReqParams = `product_ids=&category_id=${Base64.encode(productId)}&api_key=${getURLBasedCountryCode()}&client_id=&page_type=catalog_category_view&client_visitor_id=${ivid}&npb=${shoppingType}`;
  const irbReqURL = decodeURI(irbPATH + Base64.encode(irbReqParams));
  return irbReqURL;
};

export const irbSearchCollection = (ivid, search) => {
  const productId = search;
  const irbPATH = getIRB();
  const shoppingType = '2';

  const irbReqParams = `product_ids=&category_id=${Base64.encode(productId)}&api_key=${getURLBasedCountryCode()}&client_id=&page_type=catalog_category_view&client_visitor_id=${ivid}&npb=${shoppingType}`;
  const irbReqURL = decodeURI(irbPATH + Base64.encode(irbReqParams));
  return irbReqURL;
};

export const irbReqSidebar = (productId, ivid) => {
  const irbPATH = getIRB();
  const irbparam = `product_ids=${productId}&api_key=${getURLBasedCountryCode()}&page_type=catalog_product_view&fr=1&client_visitor_id=${ivid}&is_tc=1&no_of_bundles=10`;
  const irbReqURL = decodeURI(irbPATH + Base64.encode(irbparam));
  return irbReqURL;
};
