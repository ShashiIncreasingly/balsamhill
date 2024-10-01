import filter from 'lodash/filter';
import uniq from 'lodash/uniq';
import React, { useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { v4 as uuidv4 } from 'uuid';
import { countryByName, decodeEntity, formatter } from '../../lib/helpers';
import useStore from '../../zustand/store';
import ExtendedWarrantySidebar from '../ExtendedWarrantySidebar';
import Product from '../product';
import './style.scss';

function getCategoryAndProducts(sidebarBundles, cart, failedProductIDS, sidebarAddedProducts) {
  let categoryList = sidebarBundles.ProductsDetail.map((product) => product.CategoryName);
  let presentInCart = cart.map((el) => el.ProductId);

  presentInCart = [...failedProductIDS, ...sidebarAddedProducts];
  const nonEmptyCategories = [];
  let foundCategoryProducts = [];
  categoryList.map((category) => {
    foundCategoryProducts = filter(
      sidebarBundles.ProductsDetail,
      {
        CategoryName: category,
      },
    ).filter((product) => !presentInCart.includes(product.ProductId));

    if (foundCategoryProducts.length !== 0) {
      nonEmptyCategories.push(category);
    }
  });

  categoryList = nonEmptyCategories;
  categoryList = uniq(categoryList);

  const updatedBundles = sidebarBundles.ProductsDetail.filter(
    (product) => !presentInCart.includes(product.ProductId),
  );
  const currentBundle = [];
  categoryList.map((categoryName) => {
    const currentCategory = {
      category: categoryName,
      bundles: updatedBundles.filter(
        (product) => product.CategoryName === categoryName,
      ),
    };
    currentBundle.push(currentCategory);
  });
  return currentBundle;
}
function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}
function OptionsText({ options }) {
  const optionSize = Object.keys(options).length;
  if (options.empty_header_0) {
    if (isEmptyOrSpaces(options.empty_header_0)) {
      delete options.empty_header_0;
    }
  }
  if (options.empty_header_1) {
    if (isEmptyOrSpaces(options.empty_header_1)) {
      delete options.empty_header_1;
    }
  }
  if (options.empty_header_2) {
    if (isEmptyOrSpaces(options.empty_header_2)) {
      delete options.empty_header_2;
    }
  }
  return Object.keys(options).map((item, index) => (

    <span value={options[item]} key={uuidv4()}>
      {decodeEntity(options[item]).replace(/&nbsp;/g, '')}
      {' '}
      {(index < optionSize - 1) ? ' / ' : ''}
    </span>

  ));
}

function RecommendationBlock({ activeBundles, activeCategory }) {
  let getCurrentActive;
  if (activeBundles) {
    getCurrentActive = activeBundles.find((product) => product.category === activeCategory);
  }
  if (getCurrentActive) {
    return (
      <div className="inc_recommended_products_block">
        {getCurrentActive.bundles.map((product) => (<Product key={product.ProductId} type="sidebar" productObject={product} main={false} bundleIds={[]} uniqueType={999} />))}
      </div>
    );
  }
}

function Sidebar({ isOpen, setIsOpen, toggleDrawer }) {
  const cart = useStore((store) => store.cart);
  const sidebarAddedProducts = useStore((store) => store.sidebarAddedProducts);
  const clearSidebarAddedIDS = useStore((store) => store.clearSidebarAddedIDS);
  const total = useStore((store) => store.total);
  const sidebarBundles = useStore((store) => store.sidebarBundles);
  const sidebarExist = useStore((store) => store.sidebarExist);
  const saved = useStore((store) => store.saved);
  const [activeCategory, setActiveCategory] = useState();
  const [activeBundles, setActiveBundles] = useState();
  const targetRef = React.createRef();
  const directionDrawer = window.innerWidth < 800 ? 'bottom' : 'right';
  const sidebarOpen = useStore((store) => store.sidebarOpen);
  const addToCart = useStore((store) => store.addToCart);
  const extendedWarrantyMultiple = useStore((store) => store.extendedWarrantyMultiple);
  const clearWarranty = useStore((store) => store.clearWarranty);
  const removeWarranty = useStore((store) => store.removeWarranty);
  const sidebarErrors = useStore((store) => store.sidebarErrors);
  const failedProductIDS = useStore((store) => store.failedProductIDS);
  const makeCartEmpty = useStore((store) => store.makeCartEmpty);
  const addedFrom = useStore((store) => store.addedFrom);
  const [currentAddDetail, setCurrentAddDetail] = useState(addedFrom);


  const handleCategoryChange = (categoryName, idx) => {
    setActiveCategory(categoryName);
  };
  // Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.querySelector('html').style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.querySelector('html').style.overflow = '';

    }
  }, [isOpen]);

  // Load Bundels After IRB CALL
  useEffect(() => {
    if (sidebarExist) {
      if (sidebarBundles.ProductsDetail) {
        const currentBundle = getCategoryAndProducts(sidebarBundles, cart, failedProductIDS, sidebarAddedProducts);

        if (currentBundle.length !== 0) {
          setActiveBundles(currentBundle);
          setActiveCategory(currentBundle[0].category);
          if (currentAddDetail === "PDP") {
            setCurrentAddDetail('PDP_SUCCESS')
          }
        } else if (!document.querySelector('#inc_cart_modal_1')) {

          if (sidebarOpen) {
            const params = new URLSearchParams(window.location.search)
            if (params && params?.get("asm") === "true") {

              window.location.href = '/cart?asm=true'

            } else {
              window.location.href = '/cart'
            }
          }
        }
      }
    }
  }, [sidebarExist]);


  // On Cart Length Change
  useEffect(() => {
    if (sidebarBundles) {
      if (sidebarBundles.ProductsDetail && addToCart) {
        const currentBundle = getCategoryAndProducts(sidebarBundles, cart, failedProductIDS, sidebarAddedProducts);
        if (currentBundle.length !== 0) {

          setActiveBundles(currentBundle);
          const isCurrentCategoryExist = currentBundle.find(
            (categ) => categ.category === activeCategory,
          );
          if (isCurrentCategoryExist && isOpen) {
            setActiveCategory(activeCategory);
          } else {
            setActiveCategory(currentBundle[0].category);
          }
          if (currentAddDetail === "PDP") {
            setCurrentAddDetail('PDP_SUCCESS')
          }
        } else if (sidebarOpen) {
          if (!document.querySelector('#inc_cart_modal_1')) {
            const params = new URLSearchParams(window.location.search)
            if (params && params?.get("asm") === "true") {

              window.location.href = '/cart?asm=true'

            } else {
              window.location.href = '/cart'
            }

          }
        }
      }
    }
  }, [cart.length, addToCart, failedProductIDS]);



  const handleWarrantySuccess = (product) => {
    removeWarranty(product);
  };

  const handleToggle = () => {
    toggleDrawer();
    clearWarranty()
    document.body.style.overflow = '';
    document.querySelector('html').style.overflow = '';
    clearSidebarAddedIDS()
  };

  const handleCartRedirect = (e) => {

    e.preventDefault()
    const params = new URLSearchParams(window.location.search)
    if (params && params?.get("asm") === "true") {
      window.location.href = '/cart?asm=true'

    } else {
      const params = new URLSearchParams(window.location.search)
      if (params && params?.get("asm") === "true") {

        window.location.href = '/cart?asm=true'

      } else {
        window.location.href = '/cart'
      }
    }
  }
  // Hold State If Any Error
  if (!sidebarExist) {
    return <div />;
  }

  return (
    <Drawer
      open={isOpen && currentAddDetail !== "PDP"}
      onClose={handleToggle}
      direction={directionDrawer}
      className="inc_sidebar_modal_block"
      enableOverlay
      ref={targetRef}
    >
      <div className="inc_sidebar_modal_block_child">
        {' '}
        <div className="inc_sidebar_errors">
          {sidebarErrors.map((error) => <div>{error}</div>)}
        </div>
        {cart.length !== 0 && <div className="inc_sidebar_modal_cart_and_title_block">
          <div className="inc_header_title_block">
            <div className="inc_header_title_text_block">
              <div className="inc_header_title_text" style={{ textTransform: 'none' }}>Just Added To Your {countryByName() === 'United Kingdom' ? 'Basket' : 'Cart'}</div>
            </div>
            <span className="close_sidebar_icon" onClick={handleToggle} />
          </div>
          <div className="inc_sidebar_cart_added_block inc_added_1">
            <div className="inc_cart_added_list_block">
              {cart.map((product) => (
                <div className="inc_cart_added_product_block" id={product.ProductId}>
                  <div className="inc_cart_added_product_img_block">
                    <div className="inc_cart_added_product_img">
                      <img className="inc_lazy" src={product.ImageURL} alt={product.ProductName} />
                      {/* <div className="sidebar_product_quantity_label">{product.qtyAdded}</div> */}
                    </div>
                  </div>
                  <div className="inc_cart_added_product_desc_block">
                    <div className="inc_cart_added_product_desc_title_block">
                      <div className="inc_cart_added_product_desc_title_text_block">
                        <div className="inc_cart_added_product_desc_title_text" title="Easidri Cooling Coat Wide Fit" style={{ textTransform: 'unset' }}>
                          <span>
                            {product.qtyAdded}
                            {' '}
                            x
                            {' '}
                          </span>
                          {' '}
                          {product.ProductName}

                          <div />
                        </div>
                      </div>
                    </div>
                    <div className="inc_cart_added_product_desc_price_block">
                      <div className="inc_cart_added_product_desc_price_title_block">Price:</div>
                      <div className={product.SpecialPrice === 0 || product.SpecialPrice === null ? 'inc_cart_added_product_desc_price_regular_block' : 'inc_cart_added_product_desc_price_active_block'}>{formatter.format(product.Price)}</div>
                      {product.SpecialPrice !== 0 && product.SpecialPrice !== null && <div className="inc_cart_added_product_desc_price_regular_block">{formatter.format(product.SpecialPrice)}</div>}
                    </div>
                    <div className="inc_cart_added_product_desc_attributes_block">
                      {product.activeOptions && <OptionsText options={product.activeOptions} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="inc_cart_product_count_block" />
          </div>
          <div className="inc_sidebar_header_block">
            <div className="inc_header_continue_block" onClick={handleToggle}>
              <div className="inc_header_continue_img_block">
                <div className="inc_header_continue_img" />
              </div>

            </div>
            <div className="inc_header_item_block">
              <div className="inc_header_item_count_block">
                <div className="inc_header_item_count_title_block">
                  <div className="inc_header_item_count_title_text_block">
                    <div className="inc_header_item_count_title_text">Subtotal </div>
                  </div>
                </div>
                <div className="inc_header_item_count_figure_block">
                  <div className="inc_header_item_count_figure_text_block">
                    <div className="inc_header_item_count_figure_text" style={{ display: 'none' }} />
                  </div>
                </div>
                <div className="inc_cart_added_product_desc_subtotal_ecirp_block">
                  <div className="inc_cart_added_product_desc_subtotal_ecirp_active_block">
                    <div className="inc_cart_added_product_desc_subtotal_ecirp_active_text_block">
                      <div className="inc_cart_added_product_desc_subtotal_ecirp_active_text">{formatter.format(total)}</div>
                      <div className="inc_cart_added_product_desc_ecirp_active_text_msg" />
                    </div>
                  </div>
                  <div className="inc_cart_added_product_desc_subtotal_ecirp_regular_block">
                    <div className="inc_cart_added_product_desc_subtotal_ecirp_regular_text_block">
                      <div className="inc_cart_added_product_desc_subtotal_ecirp_regular_text" />
                    </div>
                  </div>
                  {saved !== 0 && (
                    <div className="inc_just_added_save_pr">

                      You Saved
                      {' '}

                      {formatter.format(saved)}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>}


        {/* Checkout Block */}
        <div className="inc_sidebar_checkout_block" style={cart.length == 0 ? { paddingTop: '24px' } : {}}>
          <div className="inc_checkout_basket_block">
            <div className="inc_checkout_basket_btn_block" onClick={(e) => handleCartRedirect(e)}>
              <div className="inc_checkout_basket_btn_img_block">
                <div className="inc_checkout_basket_btn_img" />

              </div>
              <div className="inc_checkout_basket_btn_text_block">
                <div className="inc_checkout_basket_btn_span" />
                <div className="inc_checkout_basket_btn_text">
                  <a className="view_basket_checkout" >
                    <div draggable="false">{countryByName() === 'United Kingdom' ? 'View Basket' : 'View Cart'}</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div type="button" className="inc_checkout_continue_block" onClick={handleToggle}>
            <div className="inc_checkout_continue_btn_block">
              <div className="inc_checkout_continue_btn_img_block">
                <div className="inc_checkout_continue_btn_img" />
              </div>
              <div className="inc_checkout_continue_btn_text_block">
                <div className="inc_checkout_continue_btn_text">Continue Shopping</div>
                <div className="inc_checkout_continue_btn_span" />
              </div>
            </div>
          </div>
        </div>

        {/* Extended Warranty */}
        {extendedWarrantyMultiple.length !== 0
          && (
            <div className="inc_extended_warranty_block">
              {extendedWarrantyMultiple.map((product, index) => (
                <div className="inc_product_warranty" key={product.product.code}>
                  <ExtendedWarrantySidebar warranty={product} handleWarrantySuccess={handleWarrantySuccess} />
                </div>
              ))}

            </div>
          )}

        {/* Recommendation Title */}
        <div className="inc_sidebar_recommended_block">
          <div className="inc_recommended_title_block">
            <div className="inc_recommended_title_text_block">
              <p className="inc_recommended_title_text"> Customers Also Bought</p>
            </div>
          </div>
        </div>

        {/* Recommended Tabs */}
        <div className="inc_recommended_tabs_block">
          <div className="inc_recommended_tabs_list_block inc_categ_5" tabIndex={0}>
            {activeBundles?.map((individual, idx) => (
              <div key={idx} className={`inc_recommended_tabs_list_item_block ${individual.category === activeCategory && 'inc_active'} `} title={individual.category} onClick={() => handleCategoryChange(individual.category, idx)}>
                <div className="inc_recommended_tabs_list_item_text_block">
                  <div className="inc_recommended_tabs_list_item_text">{decodeEntity(individual.category)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Block */}
        <RecommendationBlock activeBundles={activeBundles} activeCategory={activeCategory} />
      </div>
      <div className="close_modal_inc" onClick={handleToggle} />
    </Drawer>
  );
}

export default Sidebar;
