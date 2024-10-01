// Tracking API
// Types
// 1. Bundle Product Click Tracking
// 2. Bundle Add To Cart

import {
  countryByName,
  getCurrentFormattedTime, getPageType, getProductIdFromWebPage, getURLBasedCountryCode, readCookieValue,
} from '../lib/helpers';
import { clientConfig } from '../zustand/store';

const sendTrackingEvents = (importDataObj) => {
  const xhr = new XMLHttpRequest();
  const method = 'POST';
  let url = '//usaoptimizedby.increasingly.co/ImportData';
  if (countryByName() === 'Australia') {
    url = '//jpoptimizedby.increasingly.co/ImportData';
  }
  if (countryByName() === 'United Kingdom') {
    url = '//optimizedby.increasingly.co/ImportData';
  }
  xhr.onreadystatechange = handleStateChange;
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  function handleStateChange() {
    if (xhr.readyState === 4 && xhr.status === 200) { // console.log(xhr.responseText)
    }
  }

  xhr.send(JSON.stringify(importDataObj));
};

const trackingEvents = (eventType, eventDataObj, pageTypeID, PriorityType, pageTypeId, pageTid, type) => {
  if (document.querySelector('button[data-testid="pdc-btn-notifyme"].d-block') != null) {
    clientConfig.outOfStock = true;
  }

  const importEventDataObj = {};
  const importDataObj = {};
  const pageType = getPageType();
  importEventDataObj.event_data = eventDataObj;
  switch (eventType) {
    case 'bundleProductClickTracking':
      importEventDataObj.event_type = 'bundle_product_click_tracking';
      importEventDataObj.page_type = pageTypeId || pageTypeID;
      if (clientConfig.recsExist) {
        importEventDataObj.rt = '8';
        if (pageType === 'PDP') {
          if (clientConfig.outOfStock) {
            importEventDataObj.rpt = '1';
          } else if (clientConfig.recsExist) {
            importEventDataObj.rpt = '2';
          } else if (clientConfig.recsProductIds.includes(eventDataObj.product_id)) {
            importEventDataObj.rpt = '4';
          } else {
            importEventDataObj.rpt = '3';
          }
          if (document.querySelector('button[data-testid="pdc-btn-notifyme"].d-block') != null) {
            importEventDataObj.rpt = '1';
          }
        }
      }

      if ((getPageType() === 'HomePage' || getPageType() === 'ProductList' || getPageType() === 'ProductList' || getPageType() === 'SearchPage' || getPageType() === 'ContentPage' || getPageType() === 'PDP' || getPageType() === 'CartPage') && type !== 'pdp') {
        importEventDataObj.rt = '8';
        importEventDataObj.rpt = '4';
      } else {
        delete importEventDataObj.rt;
        delete importEventDataObj.rpt;
      }

      if (type === 'sidebar') {
        delete importEventDataObj.rt;
        delete importEventDataObj.rpt;
        if (pageTypeID === '202') {
          importEventDataObj.page_type = '202';
        } else {
          importEventDataObj.page_type = '107';
        }
      }

      importEventDataObj.is_logged = '0';
      importEventDataObj.method = 'track';
      if (type === 'pdp') {
        importEventDataObj.db = clientConfig.dbProducts.toString();
      }
      importEventDataObj.tid = pageTid;
      if (PriorityType) {
        importEventDataObj.pt = PriorityType.toString();
        // importEventDataObj.tid = pageTid;
      }
      if (getPageType() === 'PDP' && document.querySelector('button[data-testid="pdc-btn-notifyme"].d-block') != null) {
        importEventDataObj.rpt = '1';
      }
      if (pageTypeId === 107) {
        if (PriorityType === null) {
          delete importEventDataObj.rt;
          delete importEventDataObj.rpt;
        }
      }
      if (pageTypeId === 103) {
        if (PriorityType === null) {
          delete importEventDataObj.rt;
          delete importEventDataObj.rpt;
        }
      }
      if (pageTid === '13') {
        delete importEventDataObj.rt;
      }

      if (getPageType() === 'PDP' && countryByName() === 'United States' && pageTypeId === '117') {
        delete importEventDataObj.rt;
      }
      if (pageTypeID === '201') {
        importEventDataObj.page_type = '201';
      }
      if (pageTypeID === '203') {
        importEventDataObj.page_type = '203';
      }
      break;
    case 'bundleAddToCart':
      importEventDataObj.event_type = 'bundle_add_to_cart';
      importEventDataObj.page_type = pageTypeID;
      importEventDataObj.is_logged = '0';
      importEventDataObj.method = 'track';

      if (pageTid) {
        importEventDataObj.tid = pageTid;
      }

      if (document.querySelector('.add-to-cart-modal')) {
        importEventDataObj.tid = pageTypeId;
      }
      if (pageTypeID === '103' || pageTypeID === '107') {
        if (pageTid) {
          importEventDataObj.rt = '8';
          importEventDataObj.rpt = '4';
        }
      }
      if (pageTypeID === '103') {
        // FOR CART
        importEventDataObj.tid = pageTypeId;
      }
      break;
    default:
      break;
  }
  importEventDataObj.platform = '';
  importEventDataObj.token = clientConfig.client_id;
  importDataObj.eventData = window.btoa(JSON.stringify(importEventDataObj));
  importDataObj.uri = window.location.href;
  importDataObj.vid = readCookieValue('ivid');
  sendTrackingEvents(importDataObj);
};

function getPageTypeId() {
  const pageType = getPageType();
  let pageTypeID = null;
  switch (pageType) {
    case 'PDP':
      pageTypeID = '100';
      break;
    case 'cartPage':
      pageTypeID = '103';
      break;
    default:
      break;
  }
  return pageTypeID;
}

// Bundle Product Click Tracking
function sendBundleClickTracking(productId, PriorityType, pageTypeId, pageTid, type, mainPrd, pageModuleType) {
  const pageType = getPageType();
  let pageTypeID = null;
  switch (pageType) {
    case 'PDP':
      pageTypeID = '100';
      break;
    case 'cartPage':
      pageTypeID = '103';
      break;
    default:
      break;
  }
  if (pageTypeId === '103') {
    pageTypeID = '103';
  }
  if (pageModuleType) {
    pageTypeID = pageModuleType;
  }
  const PrdCore = getProductIdFromWebPage();
  if (pageTypeID === '103') {
    if (mainPrd === undefined) {
      mainPrd = productId;
    }
    trackingEvents('bundleProductClickTracking', {
      product_id: productId,
      core_product_id: PrdCore ? PrdCore.toString() : mainPrd,
    }, pageTypeID, PriorityType, pageTypeId, pageTid, type);
  } else {
    trackingEvents('bundleProductClickTracking', {
      product_id: productId,
      core_product_id: PrdCore ? PrdCore.toString() : '',
    }, pageTypeID, PriorityType, pageTypeId, pageTid, type);
  }
}

export function bundleViewTracking() {
  const data = {
    eventData: String(window.btoa(JSON.stringify({
      event_data: {
        product_id: getProductIdFromWebPage(),
      },
      event_type: 'catalog_product_view',
      page_type: 'catalog_product_view',
      method: 'track',
      platform: '',
      token: getURLBasedCountryCode(),
    }))),
    vid: readCookieValue('ivid'),
    time: getCurrentFormattedTime(),
    uri: document.location.href,
  };
  sendTrackingEvents(data);
}

function makeTrackingApiCall(eventdata) {
  let URL = '//usaoptimizedby.increasingly.co/ImportData';
  if (countryByName() === 'Australia') {
    URL = 'https://jpoptimizedby.increasingly.co/ImportData';
  }
  if (countryByName() === 'United Kingdom') {
    URL = '//optimizedby.increasingly.co/ImportData';
  }

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      if (xhr.responseText !== '' && xhr.responseText != null) {
        const resul = xhr.responseText;
        // console.log(`track${resul}`);
      }
    }
  };
  xhr.open('POST', URL, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(eventdata);
}

// Add Bundle To Cart Tracking
function addToCartTracking(mainProductId, currentId, addedProductIds, Bundles, type, pageTypeFromSource, tpagetypeid, tpagetid, tpriorityType, mainprd) {
  const eventType = 'bundle_add_to_cart';
  let coreProductId = '';
  const productIdsforTracking = [];
  coreProductId = mainProductId;

  const pageType = '100';
  const allData = [];

  const bundleTracking = Bundles.Bundles;

  if (type === 'multiple') {
    // FOR PDP
    // If Only First Is Added
    if (mainProductId === currentId && addedProductIds.length === 1) {
      allData.push({
        id: parseInt(bundleTracking[0].BundleId, 10),
        product_ids: [mainProductId, coreProductId],
        product_id: coreProductId,
        bundle_pos: 1,
      });
    }
    // If Only First & Second Are Selected
    if (mainProductId === currentId && addedProductIds.length > 1) {
      for (let i = 1; i < addedProductIds.length; i += 1) {
        productIdsforTracking.push(mainProductId);
        allData.push({
          id: parseInt(bundleTracking[0].BundleId, 10),
          product_ids: [mainProductId, addedProductIds[i]],
          product_id: coreProductId,
          bundle_pos: i,
        });
      }
    }
    if (mainProductId !== currentId && addedProductIds.length > 1) {
      for (let i = 1; i < addedProductIds.length; i += 1) {
        productIdsforTracking.push(mainProductId);
        allData.push({
          id: parseInt(bundleTracking[0].BundleId, 10),
          product_ids: [mainProductId, addedProductIds[i]],
          product_id: coreProductId,
          bundle_pos: i,
        });
      }
    }

    const dbCount = Bundles.ProductsDetail.length - 1;

    const data = {
      eventData: window.btoa((JSON.stringify({
        event_data: {
          bundle_data: allData,
        },
        page_type: pageType.toString(),
        event_type: eventType,
        method: 'track',
        platform: '',
        token: clientConfig.client_id,
        mb: '1',
        db: dbCount.toString(),
      }))),
      vid: readCookieValue('ivid'),
      time: getCurrentFormattedTime(),
      uri: document.location.href,
    };
    makeTrackingApiCall(JSON.stringify(data));
  } else if (type === 'single') {
    const eventDataObj = {};
    let currentBundle = Bundles.Bundles.find((product) => product.ProductIds.includes(currentId));
    if (!currentBundle && mainProductId) {
      currentBundle = Bundles.Bundles.find((product) => product.ProductIds.includes(mainProductId));
    }

    if (getPageType() === 'cartPage') {
      eventDataObj.bundle_data = {
        id: currentBundle.BundleId,
        product_ids: [currentBundle.ProductIds[0], currentId],
        product_id: currentBundle.ProductIds[0],
      };
    } else {
      eventDataObj.bundle_data = {
        id: currentBundle.BundleId,
        product_ids: [currentBundle.ProductIds[0], currentId],
        product_id: currentBundle.ProductIds[0],
      };
    }

    trackingEvents('bundleAddToCart', eventDataObj, pageTypeFromSource, tpriorityType, tpagetypeid, tpagetid);
  }
}

function bestSellerAddToCart(
  mainProductId,
  currentId,
  addedProductIds,
  Bundles,
  singleType,
  pageTypeId,
  pageTid,
  PriorityType,
  mainprd,
) {
  if ((!clientConfig.recsExist && Bundles.Bundles === 'undefined') || (Bundles.Bundles === undefined)) {
    // FOR RECS & Cart
    const eventData = {
      core_product_id: mainProductId,
      product_id: currentId,
    };
    let rptVal = '4';
    if (document.querySelector('button[data-testid="pdc-btn-notifyme"].d-block') != null) {
      clientConfig.outOfStock = true;
    }
    if (getPageType() === 'PDP') {
      const PrdCoreId = getProductIdFromWebPage();
      eventData.core_product_id = PrdCoreId ? PrdCoreId.toString() : '';
      if (clientConfig.outOfStock) {
        rptVal = '1';
      } else if (clientConfig.recsExist === true) {
        rptVal = '2';
      } else if (clientConfig.recsProductIds.includes(eventData.product_id)) {
        rptVal = '4';
      } else {
        rptVal = '3';
      }
    }
    if (getPageType() === 'HomePage' || getPageType() === 'ProductList' || getPageType() === 'ProductList' || getPageType() === 'SearchPage' || getPageType() === 'ContentPage' || getPageType() === 'PDP' || getPageType() === 'CartPage') {
      rptVal = '4';
    }
    if (document.querySelector('button[data-testid="pdc-btn-notifyme"].d-block') != null) {
      rptVal = '1';
    }
    let Data = {};
    if (pageTypeId !== undefined && pageTypeId !== null) {
      pageTypeId = pageTypeId.toString();
    }
    if (pageTid) {
      Data = {
        eventData: window.btoa((JSON.stringify({
          event_data: eventData,
          page_type: pageTypeId || getPageTypeId(),
          event_type: 'bestseller_add_to_cart',
          method: 'track',
          platform: '',
          token: clientConfig.client_id,
          rt: '8',
          rpt: rptVal,
          pt: PriorityType ? PriorityType.toString() : PriorityType,
          tid: pageTid ? pageTid.toString() : pageTid,
        }))),
        vid: readCookieValue('ivid'),
        time: getCurrentFormattedTime(),
        uri: document.location.href,
      };
    } else {
      Data = {
        eventData: window.btoa((JSON.stringify({
          event_data: eventData,
          page_type: getPageTypeId(),
          event_type: 'bestseller_add_to_cart',
          method: 'track',
          platform: '',
          token: clientConfig.client_id,
          rt: '8',
          rpt: rptVal,
        }))),
        vid: readCookieValue('ivid'),
        time: getCurrentFormattedTime(),
        uri: document.location.href,
      };
    }

    makeTrackingApiCall(JSON.stringify(Data));
  }
}
export default { sendBundleClickTracking, addToCartTracking, bestSellerAddToCart };
