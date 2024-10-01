/* eslint-disable no-trailing-spaces */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable quotes */
/* eslint-disable space-before-blocks */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import cloneDeep from 'lodash/cloneDeep';
import first from 'lodash/first';
import intersection from 'lodash/intersection';
import intersectionBy from 'lodash/intersectionBy';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import PropTypes from 'prop-types';
import {
  useEffect, useId, useRef, useState,
} from 'react';
import { useMediaQuery } from 'react-responsive';
import { v4 as uuidv4 } from 'uuid';
import { irbReqSidebar, irbReq } from '../../api/irb';
import {
  convertSetAttribute, decodeEntity, formatter, getPageType, handleFallbackImage, readCookieValue, sortArray,
} from '../../lib/helpers';
import useStore from '../../zustand/store';
import Ratings from '../atoms/Ratings';
import ModalBlock from '../modal';
import Price from '../price';
import Ranges from '../ranges';
import CheckBox from './helpers/checkbox';
import './product.scss';
import Tracking from '../../api/tracking';
import FBT from '@/pages/ProductPage/modules/FBT';


function PriceBlock({ active, special }) {
  if (special === 0 || special == null) {
    return (<span className="inc_product_modal_regular_price">{formatter.format(active)}</span>);
  }
  return (
    <>
      <span className="inc_product_modal_regular_price strikethrough">{formatter.format(active)}</span>
      <span className="inc_product_modal_regular_price">{formatter.format(special)}</span>
    </>

  );
}

function ComboAttributes({
  activeAttributes, updateActiveAttribute, activeID,
  comboAttributesArray, comboButton, pdpAttribute,
}) {
  if (activeAttributes == null) return;
  return (
    <div data={useId()} className="inc_hide_attribute">
      {/* Headers */}
      <div className={`inc_modal_attribute_header ${activeAttributes.length + 1}`}>
        {activeAttributes?.filter((attr) => attr.attributeValues.length !== 0).map((attr, index) => (
          <div key={index} className="inc_modal_attribute_header_items">
            {attr.frontEndLabel === 'Wildcard 1' || attr.frontEndLabel === 'Wildcard 2' || attr.frontEndLabel === 'Wildcard 3' || attr.frontEndLabel === 'empty_header_0' || attr.frontEndLabel === 'empty_header_1' || attr.frontEndLabel === 'empty_header_2' ? '' : attr.frontEndLabel}
          </div>
        ))}
        <div className="inc_modal_attribute_header_items">Price</div>
      </div>

      {/* Attributes */}
      <div className={`inc_modal_combo_block ${pdpAttribute && 'inc_pdp_attributes'}`}>
        {comboAttributesArray.map((subCollection, index) => (
          //  (Individual Attribute)
          <button ref={(el) => comboButton.current[index] = el} data-id={subCollection[0].childProductId} key={uuidv4()} type="button" aria-disabled="false" onClick={() => updateActiveAttribute(subCollection[0].childProductId, subCollection[0].optionText, index, subCollection[0].childProductId, subCollection.frontEndLabel, 'combo')} className={`inc_modal_combo_block_item ${subCollection[0].childProductId === activeID ? 'inc_active' : ''}`} data-cid={subCollection[0].childProductId}>
            {subCollection.map((child) => (
              <div className="inc_product_modal_combo_attributes">
                {decodeEntity(child.optionText)}
              </div>
            ))}
            <div className="inc_product_modal_combo_price">
              <PriceBlock active={subCollection[0].childProductPrice} special={subCollection[0].childProductSpecialPrice} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Helpers That Are Coupled With UI

function getHeighRange(Attributes, setRange, comboAttributesArray) {
  const findSize = Attributes.find((prod) => prod.frontEndLabel === 'Size');
  const findHeight = Attributes.find((prod) => prod.frontEndLabel === 'Height');

  const availaibleRanges = findSize || findHeight;

  if (convertSetAttribute(Attributes)) return;
  if (availaibleRanges) {
    const min = availaibleRanges.attributeValues.reduce((prev, curr) => (parseFloat(prev.optionText.replace(/^\D+/g, '')) < parseFloat(curr.optionText.replace(/^\D+/g, '')) ? prev : curr));
    const max = availaibleRanges.attributeValues.reduce((prev, curr) => (parseFloat(prev.optionText.replace(/^\D+/g, '')) > parseFloat(curr.optionText.replace(/^\D+/g, '')) ? prev : curr));
    if (min !== max && min !== undefined && max !== undefined) {
      // Check if .5
      let updatedMinText = min.optionText;
      let updatedMaxText = max.optionText;
      if (parseFloat(min.optionText.replace(/^\D+/g, '')) % 1 === 0.5) {
        updatedMinText = min.optionText;
      }
      if (parseFloat(max.optionText.replace(/^\D+/g, '')) % 1 === 0.5) {
        updatedMaxText = max.optionText;
      }
      setRange([updatedMinText, updatedMaxText]);
    }
  }
}

function Product({
  productObject, main, type, bundleIds,
  handleMiniBundle, idx, pageTypeId, pageTid, uniqueType, includeFBT, specialType, setHideFBT,
}) {
  const {
    ProductName, ProductType, Attributes,
  } = productObject;
  // States
  const [activeAttributes, setActiveAttributes] = useState(null);
  const [activeOptions, setActiveOptions] = useState({});
  const [activeMainImage, setActiveMainImage] = useState(productObject.ImageURL);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [comboAttributesArray, setcomboAttributesArray] = useState({});
  const [price, setPrice] = useState(
    { activePrice: Number(productObject.Price), specialPrice: Number(productObject.SpecialPrice) },
  );
  const [ranges, setRange] = useState([]);
  const [attributeType, setAttributeType] = useState('simple');
  const [activeID, setActiveId] = useState(productObject.ProductId);
  const [qty, setQty] = useState(1);
  const isMobileBelow = useMediaQuery({ query: '(max-width: 800px)' });
  const [mini, setMini] = useState(isMobileBelow);
  const [productType, setProductType] = useState('simple');
  const [isMainCombo, setIsMainCombo] = useState(false);
  const fetchBundle = useStore((store) => store.fetchBundle);
  const makeCartEmpty = useStore((store) => store.makeCartEmpty);
  const sidebarExist = useStore((store) => store.sidebarExist);
  const sidebarAddedProducts = useStore((store) => store.sidebarAddedProducts);
  const clientModalOpen = useStore((store) => store.clientModalOpen);
  const setClientModal = useStore((store) => store.setClientModal);
  // Store Call
  const addedProductIds = useStore((store) => store.addedProductIds);
  const addToStore = useStore((store) => store.addToStore);
  let cart = useStore((store) => store.cart);
  let bundles = useStore((store) => store.bundles);
  let mainProduct = useStore((store) => store.mainProduct);
  let firstThreePDP = useStore((store) => store.firstThreePDP);

  const addOptionsToCart = useStore((store) => store.addOptionsToCart);
  const addToCartLoader = useStore((store) => store.addToCartLoader);
  const [interalCat, setInternalCat] = useState([])

  const comboButton = useRef([]);
  const simpleButton = useRef([]);
  const [foliageType, setFoliageType] = useState(false);
  const qtyRef = useRef(null);

  let ourCategories = []

  const handleCart = (activePrice, specialPrice, quantity, source, activeIDFromSource, options, sourceImage) => {
    if (!addedProductIds.includes(productObject.ProductId) && (source !== 'action')) return;
    let updatedActivePrice = activePrice;
    let updatedSpecialPrice = specialPrice;
    const updatedQty = quantity || qty;
    if (!activePrice && !specialPrice) {
      updatedActivePrice = price.activePrice;
      updatedSpecialPrice = price.specialPrice;
    }
    const updatedProduct = {};

    updatedProduct.ProductId = productObject.ProductId;
    updatedProduct.Price = updatedActivePrice;
    updatedProduct.SpecialPrice = updatedSpecialPrice;
    updatedProduct.ImageURL = sourceImage || activeMainImage;
    updatedProduct.ProductName = productObject.ProductName;
    if (options !== undefined) {
      if (Object.keys(options).length !== 0) {
        updatedProduct.activeOptions = options;
      } else {
        updatedProduct.activeOptions = activeOptions;
      }
    } else {
      updatedProduct.activeOptions = activeOptions;
    }

    const currentActiveID = activeIDFromSource || activeID;
    // Make Cart Empty On FBT
    if (type === 'recs_fbt') {
      if (source !== 'attributes') {
        if (specialType !== 'softcart') {
          makeCartEmpty('pdp');
        }
      }
    }

    if (specialType !== 'softcart') {
      addToStore(updatedProduct, updatedQty, currentActiveID);
    }

    if (specialType === 'softcart') return;

    if (type === 'recs' && getPageType() !== 'CartPage') {
      const ivid = readCookieValue('ivid');
      const sidebarUrl = irbReqSidebar(productObject.ProductId, ivid);
      const ENVSIDEBAR = window.location.href.includes('balsam') ? sidebarUrl : 'development';
      fetchBundle(ENVSIDEBAR, 'sidebar');
    }

    if (!sidebarExist && type === 'recs_fbt') {
      const ivid = readCookieValue('ivid');
      const sidebarUrl = irbReqSidebar(productObject.ProductId, ivid);
      const ENVSIDEBAR = window.location.href.includes('balsam') ? sidebarUrl : 'development';
      fetchBundle(ENVSIDEBAR, 'sidebar');
    }
  };

  function handleAttributes(attributes, currentID, currentText, index, label) {
    // Lets Handle From To
    // Using Text Get Active Values
    const computedAttributes = [];
    let updatedActiveOption = {};
    updatedActiveOption[label] = currentText;
    // Except First Prepare All Based On The Other
    // Get All Active IDS From First Attribute To Keep It Same
    let allProductIds = [];
    const allPreviousProductIds = [];
    const firstAttributeName = attributes[0].attributeCode;
    if (index === 0) {
      cloneDeep(attributes)[0]
        .attributeValues.filter((childProduct) => childProduct.optionText === currentText
          && allProductIds.push(childProduct.childProductId));
    } else {
      cloneDeep(attributes)[0]
        .attributeValues.filter(
          (childProduct) => childProduct.optionText === activeOptions[firstAttributeName]
            && allPreviousProductIds.push(childProduct.childProductId),
        );
    }

    const foundFoliage = attributes.find((prod) => prod.attributeCode === "Foliage Type")
    setFoliageType(foundFoliage ? true : false)
    const uniqueFirstAttributes = uniqBy(attributes[0].attributeValues, (o) => o.optionText).sort((a, b) => (Number(a.optionText.replace(/[^0-9\.]/g, '')) > Number(b.optionText.replace(/[^0-9\.]/g, '')) ? 1 : -1));
    const updatedAttribute = attributes[0];
    updatedAttribute.attributeValues = uniqueFirstAttributes;
    computedAttributes.push(attributes[0]);

    // Now Loop Through Other Attributes With This ID
    cloneDeep(attributes).slice(1).map((product, idx) => {
      // Get All Products With Respect To First ID
      let syncedProducts = product;
      let uniqueSubAttributes = null;
      let updatedProduct = product;
      if (allProductIds.length === 0) {
        syncedProducts = product
          .attributeValues.filter((childProduct) => childProduct.optionText === currentText
            && allProductIds.push(childProduct.childProductId));

        updatedProduct = activeAttributes[idx + 1];
      } else {
        // Get Inital IDS

        // If Not First Will Get The IDS from First As Well
        const updatedActiveIdsToTest = intersection(allProductIds, allPreviousProductIds);
        if (updatedActiveIdsToTest.length === 0) {
          syncedProducts = product.attributeValues.filter((childProduct) => allProductIds
            .includes(childProduct.childProductId));
        } else {
          syncedProducts = product.attributeValues.filter((childProduct) => updatedActiveIdsToTest
            .includes(childProduct.childProductId));
        }

        // Set One Active Value
        const findAlreadyActive = syncedProducts.find(
          (prd) => activeOptions[product.attributeCode] === prd.optionText,
        );
        if (findAlreadyActive) {
          updatedActiveOption[product.attributeCode] = findAlreadyActive.optionText;
        } else {
          updatedActiveOption[product.attributeCode] = first(syncedProducts).optionText;
        }
        // Set Active IDS Of Selected Product
        const allChildProductIDS = [];

        product.attributeValues.filter(
          (childProduct) => childProduct.optionText === updatedActiveOption[product.attributeCode]
            && allChildProductIDS.push(childProduct.childProductId),
        );
        allProductIds = intersection(allChildProductIDS, allProductIds);
        uniqueSubAttributes = uniqBy(syncedProducts, (o) => o.optionText).sort((a, b) => (Number(a.optionText.replace(/[^0-9\.]/g, '')) > Number(b.optionText.replace(/[^0-9\.]/g, '')) ? 1 : -1));
        updatedProduct.attributeValues = uniqueSubAttributes;
      }

      return computedAttributes.push(updatedProduct);
    });

    updatedActiveOption = { ...activeOptions, ...updatedActiveOption };
    // Set Correct Active Price & Image With ChildProduct which contains all the active IDS
    const sameOptions = [];
    const clonedForOptions = cloneDeep(Attributes);
    Object.keys(updatedActiveOption).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(updatedActiveOption, key)) {
        const foundChild = clonedForOptions.find((child) => child.attributeCode === key)
          .attributeValues.filter(
            (subchild) => subchild.optionText === updatedActiveOption[key],
          );
        sameOptions.push(foundChild);
      }
    });

    const currentActive = intersectionBy(...sameOptions, 'childProductId')[0];
    setActiveMainImage(currentActive.childProductImageUrl);
    // Set ActivePrice
    const activePrice = currentActive.childProductPrice;
    const specialPrice = currentActive.childProductSpecialPrice;

    // Update State
    setPrice({
      activePrice: Number(activePrice),
      specialPrice: Number(specialPrice),
    });

    setQty(1);

    setActiveOptions({ ...updatedActiveOption });
    if (main) {
      addOptionsToCart(productObject.ProductId, updatedActiveOption);
    }
    // addOptionsToCart(currentActive.childProductId, updatedActiveOption)
    setActiveId(currentActive.childProductId);
    // Update Cart

    if (!sidebarAddedProducts.includes(productObject.ProductId)) {
      handleCart(activePrice, specialPrice, null, 'attributes', currentActive.childProductId, updatedActiveOption, currentActive.childProductImageUrl);
    }
    let resultsFromCategories = getCategoriesFromAttributes(computedAttributes)
    if (resultsFromCategories) {
      ourCategories.push(...resultsFromCategories)
      setInternalCat(resultsFromCategories)

    }
    return computedAttributes;
  }

  function getCategoriesFromAttributes(attributes, type) {

    let productsTypeArray = []
    if (type == 'combo') {
      attributes.forEach((type) => {
        let array = type.map((combo) => combo.childProductField3)
        productsTypeArray.push(...array)

      })
    } else {
      attributes.forEach((type) => {
        let array = type.attributeValues.map((childProduct) => childProduct.childProductField3)
        productsTypeArray.push(...array)

      })
    }

    return uniq(productsTypeArray)
  }
  function handleComboAttributes(attr, currentID) {
    const attribute = cloneDeep(attr);

    // Get All ActiveIDS For the ID
    let subArrayLength = 0;
    let subArrayIndex = 0;
    for (let i = 0; i < attribute.length; i++) {
      const len = attribute[i].attributeValues.length;
      if (len > subArrayLength) {
        subArrayLength = len;
        subArrayIndex = i;
      }
    }
    const allProductIds = attribute[subArrayIndex].attributeValues.map(
      (child) => child.childProductId,
    );

    const mainObj = [];
    let longestSubArrayLength = 0;

    allProductIds.map((ids, index) => {
      const subCollection = [];
      const options = {};
      attribute.map((values) => {
        const val = values.attributeValues.find((child) => child.childProductId === ids);
        // Check why val is undefined
        if (val) {
          subCollection.push(val);
          options[values.attributeCode] = val.optionText;
        }
        return values;
      });

      if (index === 0 || currentID === subCollection[0].childProductId) {
        setActiveOptions(options);
        // addOptionsToCart(productObject.ProductId, options)
        setActiveMainImage(subCollection[0].childProductImageUrl);
        setActiveId(subCollection[0].childProductId);
        // Set ActivePrice
        const activePrice = subCollection[0].childProductPrice;
        const specialPrice = subCollection[0].childProductSpecialPrice;

        // Update State
        setPrice({
          activePrice: Number(activePrice),
          specialPrice: Number(specialPrice),
        });

        setQty(1);

        if (!sidebarAddedProducts.includes(productObject.ProductId)) {
          handleCart(activePrice, specialPrice, null, 'attributes', subCollection[0].childProductId, options, subCollection[0].childProductImageUrl);
        }

        if (attribute[0] !== undefined) {
          attribute[0].activeOptions = true;
        }
      } else if (attr[0] !== undefined) {
        attribute[0].activeOptions = false;
      }
      if (attr[0] !== undefined) {
        attribute[0].activeAttributes = subCollection;
        mainObj.push(subCollection);
        if (subCollection.length > longestSubArrayLength) longestSubArrayLength = subCollection.length;
      }
      return subCollection;
    });
    let emptySpacelength = 100;
    let emptyIndex = 0;
    attribute.forEach((product, index) => {
      if (product.attributeValues.length < emptySpacelength) {
        emptySpacelength = product.attributeValues.length;
        emptyIndex = index;
      }
    });

    // HARDCODED EXTRA EMPTY ATTRUBUTE - BECAUSE ITS NOT PROVIDED IN THE FEED

    mainObj.forEach((productsArray) => {
      if (productsArray.length < longestSubArrayLength) {
        for (let i = 0; i <= longestSubArrayLength - productsArray.length; i += 1) {
          const copyOfFirst = cloneDeep(productsArray[0]);
          copyOfFirst.optionText = '-';
          productsArray.splice(emptyIndex, 0, copyOfFirst);
        }
      }
    });
    let resultsFromCategories = getCategoriesFromAttributes(mainObj, 'combo')
    if (resultsFromCategories) {
      ourCategories.push(...resultsFromCategories)
      setInternalCat(resultsFromCategories)

    }
    setcomboAttributesArray(mainObj);

    return attribute;
  }



  const updateActiveAttribute = (currentID, currentText, index, uuid, label, combo) => {
    // Create Deep Clone
    let shadowProduct = cloneDeep(productObject.Attributes);
    shadowProduct = sortArray(shadowProduct);
    let computed;
    if (combo) {
      computed = handleComboAttributes(shadowProduct, currentID, currentText, 0, label);
    } else {
      computed = handleAttributes(shadowProduct, currentID, currentText, index, label);
    }

    setActiveAttributes(computed);

    if (!isNaN(currentID)) {
      // Remove active id check because sidebar addtocart was getting updated with wrong id
      // setActiveId(currentID);
    }
  };

  const handleOpen = (source, state, productid, PriorityType, pageTypeId, pageTid, mainProductid) => {
    setIsOpen(state);
    try {
      const pageType = getPageType();
      if (type === 'sidebar' && productid) {
        Tracking.sendBundleClickTracking(productid, PriorityType, pageTypeId, pageTid, type, mainProductid, '202');
      } else if (type === 'recs_fbt' && productid) {
        Tracking.sendBundleClickTracking(productid, PriorityType, pageTypeId, pageTid, type, mainProductid, '201');
      } else if (type === 'pdp' && productid) {
        Tracking.sendBundleClickTracking(productid, PriorityType, pageTypeId, pageTid, type, mainProductid, '201');
      } else if ((type === 'recs' && pageType === 'pdp') && productid) {
        Tracking.sendBundleClickTracking(productid, PriorityType, pageTypeId, pageTid, type, mainProductid, '201');
      } else if ((type === 'recs' && (pageType === 'cartPage' || pageType === 'CartPage')) && productid) {
        Tracking.sendBundleClickTracking(productid, PriorityType, pageTypeId, pageTid, type, mainProductid, '203');
      } else if (type === 'cart' && productid) {
        Tracking.sendBundleClickTracking(productid, PriorityType, pageTypeId, pageTid, type, mainProductid, '203');
      }
    } catch (e) {
      console.log('e');
    }
    
    if (isMobileBelow && type === 'pdp') {
      if (source === 'title' || source === 'image') {
        return setMini(false);
      }
      return setMini(true);
    }
    if (isMobileBelow && type !== 'pdp') {
      setMini(false);
    }
  };

  function handleClientAttributeSync() {


    const container = document.querySelector('.productDetailContainer_product-filter-wrapper___kJ9O');
    const active =   container.querySelector('span[data-state="active"]') || container.querySelector('div[role="radio"][data-state="active"]');
    const activeDetails = active.innerText.split('\n');

    const ourButtons = document.querySelectorAll('.inc_product_info_main_block .inc_pdp_attributes button');
    const activeClientAttribute = [];

    active.querySelectorAll('.text-break').forEach((element) => {
      if (element.textContent) {
        activeClientAttribute.push(element.textContent);
      }
    });

    for (let i = 0; i < ourButtons.length; i += 1) {
      let currentText = '';
      ourButtons[i].querySelectorAll('.inc_product_modal_combo_attributes').forEach((product) => currentText += product.innerText);

      const currentTextClient = activeClientAttribute.filter((product) => !product.includes('£') && !product.includes('$') && !product.includes('€')).join('');
      if (currentText.replaceAll(/[^\x00-\x7F]/g, '').replace('yds', '').replace('cm', '').replace(/\s+/g, '')
        .replaceAll("'", '')
        .replaceAll('"', '')
        .replace('-', '') === currentTextClient.replace(/[^\x00-\x7F]/g, '').replace('yds', '').replace('cm', '')
          .replace(/\s+/g, '')
          .replaceAll("'", '')
          .replace('-', '')
          .replaceAll('"', '')) {
        ourButtons[i].click();

      }
    }
    showwHideFBT()
    // setTimeout(() => {
    //   try {

    //     incPriceMismatch();
    //   } catch (error) {

    //   }
    // }, 500);
  }
  function showwHideFBT(selectCount, count) {

    const clientATC = document.querySelector('.productDetailContainer_product-filter-wrapper___kJ9O');
    const clientATC2 = document.querySelector('button[data-testid="pdc-btn-notifyme"]');
    let hide = false;
    if (clientATC) {
      if (clientATC.innerText.trim() === 'Notify Me') {
        setHideFBT(true);
        hide = true;

        if (document.querySelector('#inc_pdp_2').parentElement) {
          if (document.querySelector('#inc_pdp_2').parentElement.parentElement) {
            document.querySelector('#inc_pdp_2').parentElement.parentElement.style.setProperty("display", "none", "important");
          }
        }
      }
    }
    if (clientATC2) {
      if (clientATC2.innerText.trim() === 'Notify Me') {
        setHideFBT(true);
        hide = true;

        if (document.querySelector('#inc_pdp_2').parentElement) {
          if (document.querySelector('#inc_pdp_2').parentElement.parentElement) {
            document.querySelector('#inc_pdp_2').parentElement.parentElement.style.setProperty("display", "none", "important");
          }
        }
      }
    } else if (selectCount === count) {
      setHideFBT(false);

      if (document.querySelector('#inc_pdp_2').parentElement) {
        if (document.querySelector('#inc_pdp_2').parentElement.parentElement) {
          document.querySelector('#inc_pdp_2').parentElement.parentElement.style.setProperty("display", "block", "important");
        }
      }
    } else if (selectCount !== count) {
      // setHideFBT(true);
      if (document.querySelector('#inc_pdp_2').parentElement) {
        if (document.querySelector('#inc_pdp_2').parentElement.parentElement) {
          document.querySelector('#inc_pdp_2').parentElement.parentElement.style.setProperty("display", "block", "important");
        }
      }
    }


    // setTimeout(() => {
    //   try {
    //     incPriceMismatch();
    //   } catch (error) {

    //   }

    // }, 500);
  }
  function handleClientAttributeSyncSimple() {
    if (!main) return;
    const container = document.querySelector('.productDetailContainer_product-filter-wrapper___kJ9O');
    const clientActive = container.querySelectorAll('div [data-state="active"]');
    const count = clientActive.length;
    let selectCount = 0;

    async function longForLoop(limit) {
      for (let j = 0; j < clientActive.length; j++) {
        await (function (j) {
          setTimeout(() => {

            if (clientActive[j]) {
              const currentOption = clientActive[j].innerText
              const ourButtons = document.querySelectorAll('.inc_product_info_main_block[data-main="true"] .inc_pdp_attributes button');
              ourButtons.forEach((button) => {

                if (button.innerText.replace(/[^\x00-\x7F]/g, '')   // Remove non-ASCII characters
                  .replace("'", '')               // Remove single quotes
                  .replaceAll('"', '')            // Remove double quotes
                  .replace(/\n/g, ' ')            // Replace newlines with spaces
                  .replace(/\s+/g, '')            // Remove all remaining spaces
                  .trim() === currentOption.replace(/[^\x00-\x7F]/g, '')   // Remove non-ASCII characters
                    .replace("'", '')               // Remove single quotes
                    .replaceAll('"', '')            // Remove double quotes
                    .replace(/\n/g, ' ')            // Replace newlines with spaces
                    .replace(/\s+/g, '')            // Remove all remaining spaces
                    .trim()) {
                  button.click();

                  selectCount += 1;

                }
              });
            }
            if (j === clientActive.length - 1) {
              showwHideFBT(selectCount, count);
            }
          }, 100 + (1000 * j));
        }(j));
      }
    }
    longForLoop(150);
    showwHideFBT()
    if (window.location.href.includes('/f/')) {
      let selected_itemid = "";
      let selectedItemId = "";
      for (let d = 0; d < window.dataLayer.length; d++) {
        if (window.dataLayer[d][1] === 'select_item' && window.dataLayer[d][2] !== undefined) {
          let items = window.dataLayer[d][2].item_list_name;
          if (items) {
            items = items.replace('PDP', '').trim();
            let isNumericId = /^-?\d+(\.\d+)?$/.test(items);
            selectedItemId = items;
            if (!isNumericId) {
              selected_itemid = items.replace('PDP', '').trim();
            }
          }
        }
      }
      // Fetch bundle data if the selected item ID has changed
      if (localStorage.getItem('selected_itemid') !== selected_itemid && selected_itemid !== "") {
        console.log("selected_itemid",selected_itemid)
        const ivid = readCookieValue('ivid');
        const FBT_URL = window.location.href.includes('balsam') ? irbReq(selected_itemid, 'b17s0mReQ6UK', ivid) : 'development';
        cart = [];
        bundles = {};
        mainProduct = {};
        firstThreePDP = [];
        fetchBundle(FBT_URL, 'pdp');
        localStorage.setItem('selected_itemid', selected_itemid);
      }
    }
  }


  function getClientAttributes() {
    const container = document.querySelector('.productDetailContainer_product-filter-wrapper___kJ9O');
    const active = container.querySelector('div[role="radio"][data-state="active"]');
    const activeDetails = active.innerText.split('\n');
    const shadowProduct = cloneDeep(productObject.Attributes);
    const uniqueArray = [];
    // Finding the common elements in both arrays
    const actives = [];

    const previousArray = [];

    const loneIds = [];
    for (let i = 0; i < activeDetails.length; i++) {
      const currentAttribute = shadowProduct.find(
        (product) => product.attributeCode === activeDetails[i],
      );
      if (currentAttribute) {
        const activeOptionTexts = currentAttribute.attributeValues.filter((product) => product.optionText.replace(/[^\x00-\x7F]/g, '') === activeDetails[i + 1].replace(/[^\x00-\x7F]/g, ''));
        const currenIDS = activeOptionTexts.map((prod) => prod.childProductId);
        const previousIDS = previousArray;
        const intersections = intersection(currenIDS, previousIDS);

        uniqueArray.push(...intersection(currenIDS, previousIDS));
        if (previousIDS.length === 0) {
          uniqueArray.push(...currenIDS);
        }
        if (previousArray.length === 0) {
          previousArray.push(...currenIDS);
        } else {
          previousArray.push(...intersections);
        }
        actives.push(...activeOptionTexts);
      }
    }

    // const currentActive = shadowProduct[0]
    const currentActive = actives.find((product) => product.childProductId === uniqueArray[0]);
    // if (currentActive === undefined) {
    //   currentActive = actives.find((product) => product.childProductId === loneIds[0]);
    //   // debugger
    // }
    return currentActive;
  }

  const debounce = (func, delay) => {
    let debounceTimer
    return function () {
      const context = this
      const args = arguments
      clearTimeout(debounceTimer)
      debounceTimer
        = setTimeout(() => func.apply(context, args), delay)
    }
  }



  // Use Effect Re-Render Entire Component
  useEffect(() => {
    // Create Deep Clone
    const deepClone = cloneDeep(productObject);
    deepClone.Attributes = productObject.Attributes ? sortArray(deepClone.Attributes) : [];
    const isAttributesAvailaible = deepClone.Attributes.length !== 0;
    if (isAttributesAvailaible) {
      const currentID = deepClone.Attributes[0].attributeValues[0].childProductId;
      const currentText = deepClone.Attributes[0].attributeValues[0].optionText;
      const label = deepClone.Attributes[0].frontEndLabel;
      let computed = null;
      const isCombo = productObject.Field6 === '1';
      if (isCombo) {
        setAttributeType('combo');

        if (main) {
          computed = handleComboAttributes(deepClone.Attributes, currentID, currentText, 0, label);
          setTimeout(() => {
            handleClientAttributeSync();
          }, 500);

        } else {
          computed = handleComboAttributes(deepClone.Attributes, currentID, currentText, 0, label);
        }
      } else {
        computed = handleAttributes(deepClone.Attributes, currentID, currentText, 0, label, 'initial');
        setTimeout(() => {
          handleClientAttributeSyncSimple();
        }, 500);

      }
      if (computed !== undefined) {
        setActiveAttributes(computed);
      }
      getHeighRange(Attributes, setRange, comboAttributesArray);
    } else if (main) {

      // incPriceMismatch('simple');
    }

    if (!isAttributesAvailaible) { setProductType('simple'); } else { setProductType('configurable'); }
  }, []);
  let currentBundleId = '';
  if (bundleIds) {
    currentBundleId = bundleIds[productObject.ProductId];
  }

  useEffect(() => {
    if (cart.length === 0 && main) {
      if (addToCartLoader == false) {
        const firstProduct = document.querySelector('.inc_product_add_checkbox_img');
        if (firstProduct) {
          firstProduct.click();
        }
      }

    }
  }, [cart.length]);

  useEffect(() => {
    if (clientModalOpen) {
      const btn = document.querySelector('.modal-open')
      const options = {
        attributes: true
      }
      let foundChange = false
      function callback(mutationList, observer) {
        mutationList.forEach(function (mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            // handle class change

            if (!document.querySelector('.modal-open') && foundChange == false) {

              foundChange = true
              observer.disconnect()
              setClientModal(false)
              setTimeout(() => {
                const firstThree = document.querySelectorAll('.inc_product_add_checkbox_img');
                for (let i = 0; i < firstThree.length; i += 1) {
                  if (i < 3) {
                    if (firstThree[i]) {
                      if (firstThree[i].classList.contains('uncheked')) {
                        firstThree[i].click();
                      }
                    }
                  }
                }
              }, 100);
            }
          }
        })
      }

      const observer = new MutationObserver(callback)
      observer.observe(btn, options)
    }

  }, [clientModalOpen === true])

  useEffect(() => {
    if (main && type == "pdp") {
      if (attributeType == "simple") {

        if (document.querySelector('.productDetailContainer_product-filter-wrapper___kJ9O')) {

        }
        document.querySelector('.productDetailContainer_product-filter-wrapper___kJ9O').addEventListener('click', debounce(() => {

          setTimeout(() => {
            // if (main) {
            //   const clientAddToCart = document.querySelector('.bButton_btn__fDFiZ.d-block.productDetailContainer_btn-notify-add__gBYP_.w-100');
            //   if (clientAddToCart) {
            //     if (clientAddToCart.innerText !== 'Notify Me') {
            //       setHideFBT(false);
            //     } else {
            //       setHideFBT(true);
            //     }
            //   }
            // }
            handleClientAttributeSyncSimple();
          }, 500);
        }, 1000));
      }
      if (attributeType == "combo" || document.querySelector('.productDetailTabularFilter_table-header__GMPzn')) {

        if (document.querySelector('.productDetailContainer_product-filter-wrapper___kJ9O')) {
          document.querySelector('.productDetailContainer_product-filter-wrapper___kJ9O').addEventListener('click', debounce(() => {
            setTimeout(() => {
              handleClientAttributeSync();
              if (main) {
                const clientAddToCart = document.querySelector('.bButton_btn__fDFiZ.d-block.productDetailContainer_btn-notify-add__gBYP_.w-100');
                const clientATC2 = document.querySelector('button[data-testid="pdc-btn-notifyme"]');
                if (clientAddToCart) {
                  if (clientAddToCart.innerText !== 'Notify Me') {
                    setHideFBT(false);
                  } else if (clientATC2) {
                    if (clientATC2.innerText !== 'Notify Me') {
                      setHideFBT(false);
                    }
                  } else {
                    setHideFBT(true);
                  }
                }
              }
            }, 1500);
          }, 1000));
        }
      }
    }



  }, [attributeType && type == 'pdp'])

  const formatProductName = (productName) => {
    const trademarkIndex = productName.indexOf("®");

    if (trademarkIndex !== -1) {
      const beforeTrademark = productName.substring(0, trademarkIndex);
      const afterTrademark = productName.substring(trademarkIndex + 1);

      return (
        <>
          {beforeTrademark}
          <sup>®</sup>
          {afterTrademark}
        </>
      );
    }

    return productName; // If symbol not found, return the original string
  };

  // AClient Attribute Match
  // if(window.location.href.includes('/f/') == true) {
    if (productObject.Field4 != null && productObject.Field4 != "") {
      productObject.ProductUrl = window.location.origin + "/f/" + productObject.Field4
    }
  // }
  const updatedUrl = productObject.ProductUrl.split('?sku')[0]
  //   .includes('?sku=')
  // ? productObject.ProductUrl.replace(/(\?sku=)[^&]*/, "?sku=" + activeID)
  // : productObject.ProductUrl + "?sku=" + activeID;
  // }
  return (
    <div data-foliage={foliageType} data-cat={interalCat} className="inc_product_showcase_block" role="contentinfo" data-productid={productObject.ProductId} data-bundleid={currentBundleId} data-main-product={main} data-activeID={activeID}>
      <div className={`inc_product_block ${ProductType} ${type}`} tabIndex="0">
        <span id="bundle-disable" />
        {type !== 'pdp' && type !== 'sidebar' && <span className="modal_btn" />}
        <div className="inc_product_info_main_block" data-main={main}>
          <div className="inc_product_img_block">
            {type === 'pdp' && <CheckBox handleCart={handleCart} productObject={productObject} />}

            <div className="inc_product_img_main_block" tabIndex="0">
              <div className="inc_product_img_main_img" role="button" tabIndex={0} onClick={() => handleOpen('image', true, productObject.ProductId, productObject.PriorityType, pageTypeId, pageTid, productObject.MainproductId)} onKeyDown={() => handleOpen('image', true, productObject.ProductId, productObject.PriorityType, pageTypeId, pageTid, productObject.MainproductId)}>
                <a href={updatedUrl + "?sku=" + activeID} onClick={(e) => e.preventDefault()} alt={productObject.ProductName} aria-label={productObject.ProductName}>
                  <img onError={(e) => handleFallbackImage(e)} src={activeMainImage} alt={productObject.ProductName} aria-label={productObject.ProductName} className="inc_product_main_img_img" />
                </a>
              </div>
            </div>

          </div>

          <div className="inc_product_desc_block">

            <div className="inc_product_desc_title_block" tabIndex="0">
              <div className="inc_product_desc_title_text_block">
                <div tabIndex={0} role="button" onClick={() => handleOpen('title', true, productObject.ProductId, productObject.PriorityType, pageTypeId, pageTid, productObject.MainproductId)} onKeyDown={() => handleOpen('title', true, productObject.ProductId, productObject.PriorityType, pageTypeId, pageTid, productObject.MainproductId)}>
                  <a href={updatedUrl + "?sku=" + activeID} onClick={(e) => e.preventDefault()} alt={productObject.ProductName} aria-label={productObject.ProductName}>
                    <p className="inc_product_desc_title_text" title={ProductName}>
                      {main && <strong>This item: </strong>}
                      {formatProductName(ProductName)}
                    </p>
                  </a>
                </div>
              </div>
            </div>

            <Ratings rating={productObject.Rating} ratingCount={productObject.RatingCount} type="productObject" />

            <Ranges ranges={ranges} />

            <Price activePrice={price.activePrice} specialPrice={price.specialPrice} />
            {productType && (
              <ModalBlock
                type={type}
                productObject={productObject}
                key={productObject.ProductID}
                activeAttributes={activeAttributes}
                price={price}
                activeMainImage={activeMainImage}
                activeOptions={activeOptions}
                updateActiveAttribute={updateActiveAttribute}
                main={main}
                attributeType={attributeType}
                qty={qty}
                setQty={setQty}
                handleCart={handleCart}
                activeID={activeID}
                modalIsOpen={modalIsOpen}
                setIsOpen={setIsOpen}
                mini={mini}
                handleOpen={handleOpen}
                qtyRef={qtyRef}
                comboAttributesArray={comboAttributesArray}
                pageTypeId={pageTypeId}
                pageTid={pageTid}
                uniqueType={uniqueType}
                includeFBT={includeFBT}
                specialType={specialType}
                comboButton={comboButton}
              />
            )}

            {attributeType === 'simple'
              && activeAttributes?.filter(
                (attr) => attr.attributeValues.length !== 0,
              ).map((attr, idx) => (
                <div className={`inc_modal_attributes_item_${idx} inc_attribute_hide inc_pdp_attributes`} key={uuidv4()}>
                  <div className="inc_modal_attribute_title">{attr.frontEndLabel}</div>
                  <div className="inc_modal_attribute_value_block">
                    {attr.attributeValues?.map((value, index) => (

                      <button
                        type="button"
                        aria-disabled="false"
                        aria-label="Attribute"
                        ref={(el) => simpleButton.current[index] = el}
                        data-id={value.childProductId}
                        onClick={() => updateActiveAttribute(
                          value.childProductId,
                          value.optionText,
                          idx,
                          value.childProductId,
                          attr.frontEndLabel,
                        )}
                        key={value.childProductId}
                        className={`${activeOptions[attr.frontEndLabel]}` === value.optionText ? `inc_modal_attribute_values inc_active ${attr.frontEndLabel.replace(/\s/g, '').toLowerCase()} ${decodeEntity(value.optionText).includes('cm') ? 'inc_cms' : ''}` : `inc_modal_attribute_values ${attr.frontEndLabel.replace(/\s/g, '').toLowerCase()} ${decodeEntity(value.optionText).includes('cm') ? 'inc_cms' : ''}`}
                      >
                        {' '}
                        {decodeEntity(value.optionText)}
                      </button>

                    ))}
                  </div>

                </div>
              ))}
            {attributeType === 'combo' && (
              <ComboAttributes
                activeAttributes={activeAttributes}
                updateActiveAttribute={updateActiveAttribute}
                activeID={activeID}
                comboAttributesArray={comboAttributesArray}
                comboButton={comboButton}
                pdpAttribute={main}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Product.propTypes = {
  productObject: PropTypes.object.isRequired,
  main: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  bundleIds: PropTypes.object,
  handleMiniBundle: PropTypes.func.isRequired,
};

export default Product;