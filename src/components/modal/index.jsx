/* eslint-disable react/jsx-indent */
import parse from 'html-react-parser';
import reduce from 'lodash/reduce';
import PropTypes from 'prop-types';
import {
  useEffect, useId, useRef, useState,
} from 'react';
import { DebounceInput } from 'react-debounce-input';
import Modal from 'react-modal';
import { useMediaQuery } from 'react-responsive';
import { v4 as uuidv4 } from 'uuid';
import {
  countryByName,
  decodeEntity, formatter,
  getRecsButton, numberToWords, parseHTML,
} from '../../lib/helpers';

import Tracking from '../../api/tracking';
import useStore from '../../zustand/store';
import Ratings from '../atoms/Ratings';
import Gallery from './gallery';
import './modal.scss';

const root = document.querySelector('#increasingly_root');
Modal.setAppElement(root);

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
  activeAttributes, updateActiveAttribute, activeID, comboAttributesArray,
}) {

  return (
    <div data={useId()}>
      {/* Headers */}
      <div className={`inc_modal_attribute_header ${activeAttributes.length + 1}`}>
        {activeAttributes?.filter((attr) => attr.attributeValues.length !== 0).map((attr) => (
          <div key={uuidv4()} className="inc_modal_attribute_header_items">
            {attr.frontEndLabel === 'Wildcard 1' || attr.frontEndLabel === 'Wildcard 2' || attr.frontEndLabel === 'Wildcard 3' || attr.frontEndLabel === 'empty_header_0' || attr.frontEndLabel === 'empty_header_1' || attr.frontEndLabel === 'empty_header_2' ? '' : attr.frontEndLabel}
          </div>
        ))}
        <div className="inc_modal_attribute_header_items">Price</div>
      </div>

      {/* Attributes */}
      <div className="inc_modal_combo_block">
        {comboAttributesArray.map((subCollection, index) => (
          //  (Individual Attribute)
          <button key={uuidv4()} type="button" aria-disabled="false" tabIndex={0} onClick={() => updateActiveAttribute(subCollection[0].childProductId, subCollection[0].optionText, index, subCollection[0].childProductId, subCollection.frontEndLabel, 'combo')} className={`inc_modal_combo_block_item ${numberToWords(activeAttributes.length + 1)} ${subCollection[0].childProductId === activeID ? 'inc_active' : ''}`} data-id={subCollection[0].childProductId}>
            {subCollection.map((child) => (
              <div className="inc_product_modal_combo_attributes ">
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

function AddToCartButton({
  productObject, type, handleAddToStore, handleOpen, selectedText, uniqueType, viewDetails, qty, errorButton, errorMessage, pageTypeId, pageTid
}) {
  const addToCartSingleLoader = useStore((store) => store.addToCartSingleLoader);
  const addToCart = useStore((store) => store.addToCart);
  const currentAddToCartId = useStore((store) => store.currentAddToCartId);

  if (errorButton) {
    if (errorMessage.length !== 0) {
      return (
        <button disabled type="button" aria-disabled="false" className="inc_modal_select_button false not_selected inc_no_edit inc_add_to_cart" onClick={() => handleAddToStore()}>
          <span>Out of stock</span>
        </button>
      );
    }
    return (
      <button disabled type="button" aria-disabled="false" className="inc_modal_select_button false not_selected inc_no_edit inc_add_to_cart" onClick={() => handleAddToStore()}>
        <span>Error</span>
      </button>
    );
  }
  if (productObject.ProductType === 'simple' && type === 'pdp') {
    if (addToCartSingleLoader && currentAddToCartId === productObject.ProductId + uniqueType) {
      return (
        <button disabled type="button" aria-disabled="false" className="inc_modal_select_button false not_selected inc_no_edit inc_add_to_cart" onClick={() => handleAddToStore()}>
          <span>Adding...</span>
        </button>
      );
    } if (addToCart && currentAddToCartId === productObject.ProductId + uniqueType) {
      return (
        <button disabled type="button" aria-disabled="false" className="inc_modal_select_button false not_selected inc_no_edit inc_add_to_cart" onClick={() => handleAddToStore()}>
          <span>Added</span>
        </button>
      );
    }
    return (
      <button type="button" aria-disabled="false" className="inc_modal_select_button false not_selected inc_no_edit" onClick={() => handleOpen('Button', true, productObject.ProductId, productObject.PriorityType, pageTypeId, pageTid, productObject.MainproductId)}>
        <span>View Details</span>
      </button>
    );
  }
  if (productObject.ProductType === 'simple' && type !== 'pdp') {
    if (addToCartSingleLoader && currentAddToCartId === productObject.ProductId + uniqueType) {
      return (
        <button disabled type="button" aria-disabled="false" className="inc_modal_select_button false not_selected inc_no_edit inc_add_to_cart" onClick={() => handleAddToStore()}>
          <span>Adding...</span>
        </button>
      );
    } if (addToCart && currentAddToCartId === productObject.ProductId + uniqueType) {
      return (
        <button disabled type="button" aria-disabled="false" className="inc_modal_select_button false not_selected inc_no_edit inc_add_to_cart" onClick={() => handleAddToStore()}>
          <span>Added</span>
        </button>
      );
    }
    return (
      <button type="button" aria-disabled="false" className="inc_modal_select_button false not_selected inc_no_edit inc_add_to_cart" onClick={() => handleAddToStore()}>
        <span>
          Add to
          {' '}
          {countryByName() === 'United Kingdom' ? 'Basket' : 'Cart'}
        </span>
      </button>
    );
  }
  if (productObject.ProductType !== 'simple' && type === 'pdp') {
    return (
      <button type="button" aria-disabled="false" className={`inc_modal_select_button false  inc_no_edit ${selectedText !== 'Select Option' ? 'selected' : 'not_selected'}`} onClick={() => handleOpen('Button', true, productObject.ProductId, productObject.PriorityType, pageTypeId, pageTid, productObject.MainproductId)}>
        <span>{selectedText}</span>
      </button>
    );
  }
  if (productObject.ProductType !== 'simple' && type !== 'pdp' && !viewDetails) {
    if (addToCartSingleLoader && currentAddToCartId === productObject.ProductId + uniqueType) {
      return (
        <button disabled type="button" aria-disabled="false" className="inc_modal_select_button false not_selected inc_no_edit inc_add_to_cart" onClick={() => handleAddToStore()}>
          <span>Adding...</span>
        </button>
      );
    } if (addToCart && currentAddToCartId === productObject.ProductId + uniqueType) {
      return (
        <button disabled type="button" aria-disabled="false" className="inc_modal_select_button false not_selected inc_no_edit inc_add_to_cart" onClick={() => handleAddToStore()}>
          <span>Added</span>
        </button>
      );
    }
    return (
      <button type="button" aria-disabled="false" className="inc_modal_select_button false not_selected inc_no_edit" onClick={() => handleOpen('Button', true, productObject.ProductId, productObject.PriorityType, pageTypeId, pageTid, productObject.MainproductId)}>
        <span>Select Option</span>
      </button>
    );
  }
  if (productObject.ProductType !== 'simple' && type !== 'pdp' && viewDetails) {
    if (addToCartSingleLoader && currentAddToCartId === productObject.ProductId + uniqueType) {
      return (
        <button disabled type="button" aria-disabled="false" className="inc_modal_select_button false not_selected inc_no_edit inc_add_to_cart" onClick={() => handleAddToStore()}>
          <span>Adding...</span>
        </button>
      );
    } if (addToCart && currentAddToCartId === productObject.ProductId + uniqueType) {
      return (
        <button disabled type="button" aria-disabled="false" className="inc_modal_select_button false not_selected inc_no_edit inc_add_to_cart" onClick={() => handleAddToStore()}>
          <span>Added</span>
        </button>
      );
    }
    return (
      <button type="button" aria-disabled="false" className="inc_modal_select_button false not_selected inc_no_edit" onClick={() => handleOpen('Button', true, productObject.ProductId, productObject.PriorityType, pageTypeId, pageTid, productObject.MainproductId)}>
        <span>View Details</span>
      </button>
    );
  }
}

function ModalBlock({
  productObject, activeAttributes, activeMainImage, price, activeOptions,
  updateActiveAttribute, main, type, attributeType, qty, setQty, handleCart, activeID,
  modalIsOpen, setIsOpen, mini, handleOpen, comboAttributesArray, pageTypeId, pageTid, uniqueType, includeFBT, specialType,
  comboButton,qtyRef
}) {
  const addedProductIds = useStore((store) => store.addedProductIds);
  const addSingleToClient = useStore((store) => store.addSingleToClient);
  const addToCartLoader = useStore((store) => store.addToCartLoader);
  const addToCart = useStore((store) => store.addToCart);
  const isMobileBelow = useMediaQuery({ query: '(max-width: 800px)' });
  const cartBundles = useStore((store) => store.cartBundles);
  const bundles = useStore((store) => store.bundles);
  const bundlesExist = useStore((store) => store.bundlesExist);
  const addOptionsToCart = useStore((store) => store.addOptionsToCart);
  const sidebarOpen = useStore((store) => store.sidebarOpen);
  const handleCurrentAddToCartId = useStore((store) => store.handleCurrentAddToCartId);
  const currentAddToCartId = useStore((store) => store.currentAddToCartId);
  const sidebarBundles = useStore((store) => store.sidebarBundles);
  const setSidebarErrors = useStore((store) => store.setSidebarErrors);
  const sidebarErrors = useStore((store) => store.sidebarErrors);
  const makeCartEmpty = useStore((store) => store.makeCartEmpty);
  const handleFailedProductIDS = useStore((store) => store.handleFailedProductIDS);

  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedText, setSelectedText] = useState('Select Option');
  const [buttonText, setButtonText] = useState('Add to Bundle');
  const [alert, showAlert] = useState(false);
  const [imageGallery, setImageGallery] = useState(productObject.OtherImageList);
  const [description, setDescription] = useState(null);
  const [viewDetails, setViewDetails] = useState(false);
  const [errorButton, setErrorButton] = useState(false);

  const descriptionRef = useRef(null);
  const timeoutRef = useRef(null);

  if (productObject.Field4 != null && productObject.Field4 != "") {
    productObject.ProductUrl = window.location.origin + "/f/" + productObject.Field4
  }
  productObject.ProductUrl = productObject.ProductUrl.split('?sku')[0]
  //  HANDLE MODAL

  function afterOpenModal() {
    if (document.querySelector('.add-to-cart-modal')) {
      document.querySelector('.add-to-cart-modal').removeAttribute('tabindex');
    }
    // references are now sync'd and can be accessed.\
    document.querySelector('body').style.overflow = 'hidden';
    document.querySelector('html').style.overflow = 'hidden';
  }

  function closeModal(from_source) {
    clearTimeout(timeoutRef.current);
    setIsOpen(false);
    if (document.querySelector('.add-to-cart-modal')) {
      if (from_source === 'from_store' && from_source !== 'pdp' && from_source !== 'update') {
        setQty(1);
      }
      document.querySelector('.add-to-cart-modal').setAttribute('tabindex', -1);
    }
    console.log("reset")
    if (from_source === 'pdp' && document.querySelector('.inc_modal_button') != null) {
      if (document.querySelector('.inc_modal_button').innerText !== 'Update') {
          setQty(1);
      }
    } else if (from_source !== 'from_store' && from_source !== 'pdp' && from_source != null && from_source !== 'update') {
        setQty(1);
    }
    if (sidebarOpen === false) {
      document.body.style.overflow = '';
      document.querySelector('html').style.overflow = '';
    }

    if (document.querySelector('.EZDrawer') == null) {
      document.body.style.overflow = '';
      document.querySelector('html').style.overflow = '';
      if (modalIsOpen) {
        if (type === 'pdp') {
          if (addedProductIds.includes(productObject.ProductId)) {
            handleCart(price.activePrice, price.specialPrice, null, 'action', activeID);
          }
        }
      }
    }
    showAlert(false);
  }

  const handleAddToStore = () => {
    closeModal('update');
    if (type === 'pdp') {
      handleCart(price.activePrice, price.specialPrice, null, 'action', activeID);
      closeModal('update');
    } else if (type === 'recs') {
      Tracking.bestSellerAddToCart(
        productObject.ProductId,
        productObject.ProductId,
        addedProductIds,
        productObject,
        'single',
        pageTypeId,
        pageTid,
        productObject.PriorityType,
        productObject.ProductId,
      );

      addSingleToClient(activeID, qty, type).then((response) => {
        if (response.data.errors) {
          const errorMessage = `${productObject.ProductName} -${response.data.errors[0].message}`;
          setSidebarErrors(errorMessage);
          handleFailedProductIDS(productObject.ProductId);
          setErrorButton(true);
          setTimeout(() => {
            setErrorButton(false);
          }, 2500);
        } else if (response.status == 401) {
          const errorMessage = `${productObject.ProductName} - We are experiencing some issues at our end`;
          setSidebarErrors(errorMessage);
          handleFailedProductIDS(productObject.ProductId);
          setErrorButton(true);
          setTimeout(() => {
            setErrorButton(false);
          }, 2500);
        } else {
          handleCart(price.activePrice, price.specialPrice, null, 'action', activeID);
        }
      });
    } else if (type === 'recs_fbt') {
      closeModal('from_store');
      let bundleID;
      if (bundlesExist) {
        bundleID = bundles.Bundles.find((product) => product.ProductIds.includes(productObject.ProductId));
      }

      if (countryByName() == 'United States' && bundleID !== undefined) {
        Tracking.addToCartTracking(
          productObject.MainproductId,
          productObject.ProductId,
          addedProductIds,
          bundles,
          'single',
          pageTypeId,
          pageTid,
          productObject.PriorityType,
          productObject.MainproductId,
        );
      } else {
        Tracking.bestSellerAddToCart(
          productObject.ProductId,
          productObject.ProductId,
          addedProductIds,
          productObject,
          'single',
          pageTypeId,
          pageTid,
          productObject.PriorityType,
          productObject.ProductId,
        );
      }

      addSingleToClient(activeID, qty, type).then((response) => {
        if (response.data.errors) {
          const errorMessage = `${productObject.ProductName} -${response.data.errors[0].message}`;
          setSidebarErrors(errorMessage);
          if (specialType !== 'softcart') {
            makeCartEmpty('pdp');
          }
          setErrorButton(true);
          setTimeout(() => {
            setErrorButton(false);
          }, 2500);
          handleFailedProductIDS(productObject.ProductId);
        } else if (response.status === 401) {
          const errorMessage = `${productObject.ProductName} -  Not able to add we are experiencing some issues at our end`;
          setSidebarErrors(errorMessage);
          handleFailedProductIDS(productObject.ProductId);
          setErrorButton(true);
          setTimeout(() => {
            setErrorButton(false);
          }, 2500);
        } else {
          handleCart(price.activePrice, price.specialPrice, qty, 'action', activeID);
        }
      });
    } else if (type === 'cart') {
      // cartBundles.ProductsDetail[0].ProductId,

      Tracking.addToCartTracking(
        productObject.MainproductId,
        productObject.ProductId,
        addedProductIds,
        cartBundles,
        'single',
        pageTypeId,
        pageTid,
        productObject.PriorityType,
        productObject.MainproductId,
      );
      addSingleToClient(activeID, qty, type).then((response) => {
        if (response.data.errors) {
          setErrorButton(true);
          setTimeout(() => {
            setErrorButton(false);
          }, 2500);
          handleFailedProductIDS(productObject.ProductId);
        } else if (response.status == 401) {
          setErrorButton(true);
          setTimeout(() => {
            setErrorButton(false);
          }, 2500);
          handleFailedProductIDS(productObject.ProductId);
        }
      });
    } else if (type === 'sidebar') {
      Tracking.addToCartTracking(
        sidebarBundles.ProductsDetail[0].ProductId,
        productObject.ProductId,
        addedProductIds,
        sidebarBundles,
        'single',
        '107',
        pageTid,
        productObject.PriorityType,
        sidebarBundles.ProductsDetail[0].ProductId,
      );

      addSingleToClient(activeID, qty, type).then((response) => {
        if (response.data.errors) {
          const errorMessage = `${productObject.ProductName} -${response.data.errors[0].message}`;
          setSidebarErrors(errorMessage);
          setErrorButton(true);
          handleFailedProductIDS(productObject.ProductId);
        } else if (response.status == 401) {
          const errorMessage = `${productObject.ProductName} - Not able to add we are experiencing some issues at our end`;
          setSidebarErrors(errorMessage);
          handleFailedProductIDS(productObject.ProductId);
          setErrorButton(true);
        } else {
          handleCart(price.activePrice, price.specialPrice, qty, 'action', activeID);
        }
      });
    }

    handleCurrentAddToCartId(productObject.ProductId, uniqueType);
  };

  // HANDLE QTY

  const handleInput = (e) => {
    if (e.keyCode == 190) e.preventDefault();
    if (e.target.value.length > 2) e.preventDefault();
  };

  const handleKeyUp = (e) => {
    let updatedQty = e.target.value;
    let checkforone = '';
    clearTimeout(checkforone);
    if (e.target.value.length === 0) {
      checkforone = setTimeout(() => {
        if (e.target.value.length === 0) {
          updatedQty = 1;
          setQty(updatedQty);
          e.target.value = updatedQty;
          clearTimeout(checkforone);
        } else {
          clearTimeout(checkforone);
        }
      }, 500);
    } else {
      clearTimeout(checkforone);
    }
  };

  const handleQtyChange = (e) => {
    let updatedQty = e.target.value;
    if (e.target.value.length === 0) {
      updatedQty = 1;
      setQty(updatedQty);
      e.target.value = 1;
    } else if (e.target.value > 99) {
      updatedQty = 99;
      setQty(updatedQty);
    } else if (e.target.value <= 0) {
      updatedQty = 1;
      setQty(updatedQty);
    }

    setQty(updatedQty);
    if (document.querySelector('.inc_modal_parent_block input')) {
      document.querySelector('.inc_modal_parent_block input').value = updatedQty;
    }
    handleCart(price.activePrice, price.specialPrice, updatedQty, 'qty');
  };

  const updateQty = (qtyType) => {
    let updated = qty;

    if (qtyType === 'increase' && qty < 100) {
      updated = Number(qty) + 1;
      if (qty != 99) {
        setQty(updated);
      }
    } else if (qtyType === 'decrease' && qty > 1) {
      updated = Number(qty) - 1;
      setQty(updated);
    } else {
      if (qty > 1 && qty < 100) {
        updated = Number(qty) + 1;
      }
      setQty(updated);
    }
    handleCart(price.activePrice, price.specialPrice, updated, 'qty');
  };

  function updatedSelectText() {
    let options = '';
    Object.values(activeOptions).forEach((value) => {
      if (options === '') {
        options = value.replace(/&nbsp;/g, '');
      } else {
        options += ` / ${value.replace(/&nbsp;/g, '')}`;
      }
    });
    if (addedProductIds.includes(productObject.ProductId)) {
      setSelectedText(decodeEntity(options));
      if (type === 'pdp' || type === 'sidebar') {
        const updatedProduct = productObject;
        updatedProduct.ImageURL = activeMainImage;
        // addOptionsToCart(updatedProduct.ProductId, activeOptions, updatedProduct);
      }
    }
  }

  const handleUpdateAttributes = (childProductId, optionText, idx, childPrdID, frontEndLabel) => {
    updateActiveAttribute(childProductId, optionText, idx, childPrdID, frontEndLabel);
  };

  const handleActivTab = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    updatedSelectText();
    if (type !== 'pdp') {
      setButtonText(getRecsButton());
    } else if (addedProductIds.includes(productObject.ProductId)) {
      setButtonText('Update');
    } else if (!addedProductIds.includes(productObject.ProductId)) {
      setButtonText('Add to Bundle');
    }
  }, [activeOptions, addedProductIds, type]);

  // Handle Button Text Change
  useEffect(() => {
    closeModal(type);
  }, [addToCartLoader && type !== 'pdp' && currentAddToCartId === productObject.ProductId + uniqueType]);

  useEffect(() => {
    if (addToCart === true) {
      if (type === 'cart') {
        if (currentAddToCartId === productObject.ProductId + uniqueType) {
          return setTimeout(() => {
            const params = new URLSearchParams(window.location.search)
            if (params && params?.get("asm") === "true") {
            
              window.location.href = '/cart?asm=true'

            } else {
              window.location.href = '/cart'
            }
          }, 1000);
        }
      }
      if (type === 'sidebar') return closeModal(type);
      setButtonText(getRecsButton());
      if (currentAddToCartId === productObject.ProductId + uniqueType && type === 'recs') {
        setButtonText('Added');
        const changeButton = setTimeout(() => {
          setButtonText(getRecsButton());
          clearTimeout(changeButton);
        }, 3000);
        return closeModal(type);
      }
    }
  }, [addToCart === true && type !== 'pdp']);

  // TAB - NO CHANGE
  useEffect(() => {
    setActiveTab('Overview');
  }, [modalIsOpen]);

  // ATTRIBUTES - NO CHANGE
  useEffect(() => {
    if (activeAttributes) {
      if (productObject.OtherImageList) {
        if (activeAttributes[0].attributeValues[0].childProductOtherImageUrl) {
          setImageGallery([...productObject.OtherImageList,
          ...activeAttributes[0].attributeValues[0].childProductOtherImageUrl] || []);
        } else {
          setImageGallery([...productObject.OtherImageList]);
        }
      } else {
        setImageGallery([]);
      }
      const attributeCount = activeAttributes.length;
      const subCount = reduce(
        activeAttributes.map(
          (child) => child.attributeValues.length,
        ),
        (sum, n) => sum + n,

        0,
      );
      if (subCount === attributeCount && !main) {
        if (!addedProductIds.includes(productObject.ProductId)) {
          setViewDetails(true);
        }
      }
    }
    if (document.querySelector('.inc_modal_parent_block input')) {
      if (document.querySelector('.inc_modal_parent_block input').value.length == 0) {
        document.querySelector('.inc_modal_parent_block input').setAttribute('value', 1);
        document.querySelector('.inc_modal_parent_block input').value = 1;
        setTimeout(() => {
          if (document.querySelector('.inc_modal_parent_block input')) {
            if (document.querySelector('.inc_modal_parent_block input').value.length == 0) {
              document.querySelector('.inc_modal_parent_block input').setAttribute('value', 1);
              document.querySelector('.inc_modal_parent_block input').value = 1;
            }
          }
        }, 0);
      }
    }
  }, [activeAttributes]);

  // DESCRIPTION  - NO CHANGE
  useEffect(() => {
    if (productObject.Description) {
      const stringifiedHtml = parseHTML(productObject.Description);
      if (productObject.Description.length !== 0) {
        setDescription(stringifiedHtml.replace(/\\t/g, '').replace('<sup&reg;<></sup&reg;<>', ''));
      }
    }
  }, [productObject.Description]);

  const sendClickTrackDelayed = (ProductId, PriorityType, pageTypeId, pageTid, mainProductid) => {
    if (type === 'sidebar') {
      pageTypeId = '107';
    }
    Tracking.sendBundleClickTracking(ProductId, PriorityType, pageTypeId, pageTid, type, mainProductid);
    setTimeout(() => {
      window.location.href = `${productObject.ProductUrl}?sku=${activeID}`;
    }, 1000);
  };
  function handleKeyPress() {
    // console.log('You pressed a key.');
  }
  return (
    <div className="inc_modal_block" key={productObject.ProductID} data-productid={productObject.ProductId}>
      <AddToCartButton
        productObject={productObject}
        type={type}
        handleAddToStore={handleAddToStore}
        handleOpen={handleOpen}
        selectedText={selectedText}
        uniqueType={uniqueType}
        viewDetails={viewDetails}
        qty={qty}
        errorButton={errorButton}
        errorMessage={sidebarErrors}
        pageTypeId={pageTypeId}
        pageTid={pageTid}
      />
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={() => afterOpenModal()}
        onRequestClose={() => closeModal(type)}
        preventScroll
        shouldReturnFocusAfterClose={false}
      >
        <div className={`inc_modal_parent_block ${mini ? 'mini' : 'max'}`}>
          {' '}
          <button type="button" aria-disabled="false" aria-label="Close" className="inc_product_header_close_button" onClick={() => closeModal(type)} />
          <div className="inc_product_modal_header_main_block ">

            <a
              className="inc_product_header_main_title_block"
              onClick={(e) => {
                e.preventDefault();
                sendClickTrackDelayed(productObject.ProductId, productObject.PriorityType, pageTypeId, pageTid, productObject.MainproductId);
              }}
              title={productObject.ProductName}
              rel="noopener noreferrer"
              alt={productObject.ProductName}
              aria-label={productObject.ProductName}
              href={`${productObject.ProductUrl}?sku=${activeID}`}
            >
              {productObject.ProductName}

            </a>

            <Ratings rating={productObject.Rating} ratingCount={productObject.RatingCount} type="modal" />
            <div className="inc_product_header_tabs">
              <div role="button" aria-label="Tab Overview" tabIndex={0} className={activeTab === 'Overview' ? 'inc_product_header_tab inc_active' : 'inc_product_header_tab'} onClick={() => handleActivTab('Overview')} onKeyDown={() => handleActivTab('Overview')}>Overview</div>
              {description && <div role="button" aria-label="Tab Description" tabIndex={0} className={activeTab === 'Description' ? 'inc_product_header_tab inc_active' : 'inc_product_header_tab'} onClick={() => handleActivTab('Description')} onKeyDown={() => handleActivTab('Description')}>Description</div>}
              <a target="_blank" onClick={(e) => Tracking.sendBundleClickTracking(productObject.ProductId, productObject.PriorityType, pageTypeId, pageTid, type, productObject.MainproductId)} href={`${productObject.ProductUrl}?sku=${activeID}`} alt={productObject.ProductName} aria-label={productObject.ProductName} className="inc_product_header_tab inc_product_header_new_tab" tabIndex={0} rel="noreferrer">Open In A New Tab</a>
            </div>

          </div>
          <div className="inc_product_modal_content">
            <div className="inc_product_modal_left">

              {activeTab === 'Description' && <div ref={descriptionRef} className="inc_product_modal_description">{parse(description)}</div>}
              {activeTab === 'Overview' && (
                <div className="inc_product_modal_gallery">
                  {activeMainImage && (
                    <Gallery
                      images={imageGallery}
                      activeMainImage={activeMainImage}
                      ProductId={productObject.ProductId}
                      ProductUrl={`${productObject.ProductUrl}?sku=${activeID}`}
                      sendClickTrackDelayed={sendClickTrackDelayed}
                      priorityType={productObject.PriorityType}
                      pageTypeId={pageTypeId}
                      pageTid={pageTid}
                      ProductName={productObject.ProductName}
                      mainProductid={productObject.MainproductId}
                    />
                  )}

                </div>
              )}
            </div>
            <div className="inc_product_modal_right">
              {
                isMobileBelow ? (
                  <>
                    <a className="inc_product_header_main_title_block" onClick={(e) => sendClickTrackDelayed(productObject.ProductId, productObject.PriorityType, pageTypeId, pageTid, productObject.MainproductId)} title={productObject.ProductName} rel="noopener noreferrer" alt={productObject.ProductName} aria-label={productObject.ProductName}>{productObject.ProductName}</a>
                    <Ratings rating={productObject.Rating} ratingCount={productObject.RatingCount} type="modal" />
                  </>
                ) : ('')
              }
              <div className="inc_product_modal_price_block">
                {price.specialPrice == null || price.specialPrice === 0 ? (
                  <>
                    {' '}
                    <div className="inc_product_modal_active_price ">{formatter.format(price.activePrice)}</div>
                  </>
                ) : (
                  <>
                    <div className="inc_product_modal_regular_price strikethrough">{formatter.format(price.activePrice)}</div>
                    <div className="inc_product_modal_price" bis_skin_checked="1">
                      <div className="inc_product_modal_active_price">{formatter.format(price.specialPrice)}</div>
                    </div>

                  </>
                )}

              </div>
              <div className="inc_modal_attributes_block">

                {attributeType === 'simple'
                  ? activeAttributes?.filter(
                    (attr) => attr.attributeValues.length !== 0,
                  ).map((attr, idx) => (
                    <div className={`inc_modal_attributes_item_${idx}`} key={uuidv4()}>
                      <div className="inc_modal_attribute_title">{attr.frontEndLabel}</div>
                      <div className="inc_modal_attribute_value_block">
                        {attr.attributeValues?.map((value) => (

                          <button
                            type="button"
                            aria-label="Attribute"
                            aria-disabled="false"
                            tabIndex={0}
                            data-id={value.childProductId}
                            onClick={() => handleUpdateAttributes(
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
                  ))
                  : (
                    <ComboAttributes
                      activeAttributes={activeAttributes}
                      updateActiveAttribute={updateActiveAttribute}
                      activeID={activeID}
                      comboAttributesArray={comboAttributesArray}
                      comboButton={comboButton}
                    />
                  )}
              </div>
              <div className="inc_modal_qty">
              <button
                type="button"
                aria-disabled={qty <= 0}
                aria-label="Decrease Quantity"
                className={`inc_modal_qty_minus inc_modal_qty_minus ${qty === 1 && 'qty_disable'}`}
                onClick={() => updateQty('decrease')}
                disabled={qty <= 0} 
              >
                -
              </button>
                <div className="inc_modal_qty_input_block" tabIndex="0">
                  <DebounceInput
                    debounceTimeout={500}
                    type="number"
                    min="1"
                    max="20"
                    maxLength={2}
                    minLength={1}
                    // onKeyPress={(e) => handleKeyPress(e)}
                    name="product_qty"
                    onKeyUp={(e) => handleKeyUp(e)}
                    onKeyDown={(e) => handleInput(e)}
                    onChange={(e) => handleQtyChange(e)}
                   
                    value={qty}
                  />
                </div>
                <button type="button" aria-disabled="false" aria-label="Increase" className="inc_modal_qty_plus" onClick={() => updateQty('increase')} />
              </div>
              <button type="button" aria-disabled="false" className="inc_modal_button" onClick={() => handleAddToStore(productObject)}>{buttonText}</button>

              {isMobileBelow && !mini && (

                <div className="inc_modal_full_deatils">
                  <a href={`${productObject.ProductUrl}?sku=${activeID}`} alt={productObject.ProductName} aria-label={productObject.ProductName}>

                    <span>

                      View Full Details
                    </span>
                  </a>
                </div>
              )}

              {alert && (
                <div className="inc_product_message_alert_block ">
                  {' '}
                  <div className="inc_product_message_alert_text">Added to your basket</div>
                  {' '}
                </div>
              )}
            </div>
          </div>

        </div>

      </Modal>
    </div>
  );
}

ComboAttributes.propTypes = {
  activeAttributes: PropTypes.array,
  updateActiveAttribute: PropTypes.func.isRequired,
  comboAttributesArray: PropTypes.array.isRequired,
  activeID: PropTypes.string.isRequired,
};

ModalBlock.propTypes = {
  productObject: PropTypes.objectOf(PropTypes.productObject).isRequired,
  activeAttributes: PropTypes.array,
  activeMainImage: PropTypes.string.isRequired,
  price: PropTypes.object.isRequired,
  activeOptions: PropTypes.object.isRequired,
  updateActiveAttribute: PropTypes.func.isRequired,
  main: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  attributeType: PropTypes.string.isRequired,
  qty: PropTypes.number.isRequired,
  setQty: PropTypes.func.isRequired,
  activeID: PropTypes.string,
  handleCart: PropTypes.func.isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  comboAttributesArray: PropTypes.array.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  mini: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
};

export default ModalBlock;
