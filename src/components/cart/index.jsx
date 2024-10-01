import React, { useEffect, useState } from 'react';
import Tracking from '../../api/tracking';
import { formatter, getCartButton } from '../../lib/helpers';
import useStore from '../../zustand/store';
import Loader from '../loader';
import './styles.scss';

function Cart() {
  const cart = useStore((store) => store.cart);
  const total = useStore((store) => store.total);
  const totalCartQuantity = useStore((store) => store.totalCartQuantity);
  const saved = useStore((store) => store.saved);
  const addToClient = useStore((store) => store.addToClient);
  const updateClientCart = useStore((store) => store.updateClientCart);
  
  const addToCartLoader = useStore((store) => store.addToCartLoader);
  const addToCart = useStore((store) => store.addToCart);
  const handleCartLoaderState = useStore((store) => store.handleCartLoaderState);

  const addedFrom = useStore((store) => store.addedFrom);
  const addedProductIds = useStore((store) => store.addedProductIds);
  const bundles = useStore((store) => store.bundles);
  const handleIsMobileOpen = useStore((store) => store.handleIsMobileOpen);
  const handleSidebar = useStore((store) => store.handleSidebar);
  const sidebarBundles = useStore((store) => store.sidebarBundles);
  const sidebarAddedProducts = useStore((store) => store.sidebarAddedProducts);

  const [cartText, setCartText] = useState('Item');
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawer = () => {
  
    
    handleSidebar(true);
    setIsOpen((prevState) => !prevState);
    
  };

  if (!cart) {
    return <Loader />;
  }
  useEffect(() => {
    if (totalCartQuantity > 1) {
      setCartText('Items');
    } else {
      setCartText('Item');
    }
  }, [totalCartQuantity]);

  useEffect(() => {
    if (addToCart && addedFrom === 'PDP') {
      if (sidebarBundles){
        if (sidebarBundles.ProductsDetail.length <= cart.length) {
          const params = new URLSearchParams(window.location.search)
          if (params && params?.get("asm") === "true"){
            
            window.location.href = '/cart?asm=true'
           
          }else {
            window.location.href = '/cart'
          }
        } else {
          toggleDrawer();
          handleCartLoaderState();
        }
      }
    }
  }, [addToCart]);

  const handleAddToCart = () => {
    Tracking.addToCartTracking(
      bundles.ProductsDetail[0].ProductId,
      cart[0].ProductId,
      addedProductIds,
      bundles,
      'multiple',
    );
    
    updateClientCart('fbt').then((response) => {
     if (response){
      addToClient(cart);
     }
    })
    
   
  };

  const changeIsMobileOpen = () => {
    handleIsMobileOpen();
  };

  return (
    <div className="inc_pdp_simple_cart_block" data-cart={JSON.stringify(cart)}>

      <div className="inc_pdp_simple_cart_item">
        <div className="inc_pdp_simple_cart_item_text">
          {totalCartQuantity}
          {' '}
          {cartText}
        </div>
      </div>

      <div className="inc_pdp_bundle_cart_price" onClick={() => changeIsMobileOpen()}>
        <div className="inc_pdp_bundle_cart_price_heading">Total Bundle Price</div>
        <div className="inc_pdp_bundle_cart_price_block">
          <div className="inc_pdp_bundle_cart_active">{formatter.format(total)}</div>
          {saved !== 0 && (
            <div className="inc_pdp_bundle_cart_saved">
              You Saved
              {' '}
              {formatter.format(saved)}
            </div>
          )}

        </div>
        <div className="inc_pdp_arrow_block" />
      </div>
      <button aria-disabled="false" disabled={addToCartLoader} className={`inc_pdp_bundle_cart_button ${addToCartLoader ? 'inc_loading' : ''}`} onClick={() => handleAddToCart()}>{`Add ${totalCartQuantity} ${cartText} to ${getCartButton()}`}</button>
      {/* <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} toggleDrawer={toggleDrawer} /> */}
    </div>
  );
}

export default Cart;
