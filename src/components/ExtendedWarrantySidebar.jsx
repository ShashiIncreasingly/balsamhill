import { formatter } from '@/lib/helpers';
import useStore from '@/zustand/store';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

function ExtendedWarrantySidebar({ warranty, handleWarrantySuccess }) {
  const [activeButton, setActiveButton] = useState(false);
  const [activeAddToCart, setActiveAddToCart] = useState(false);
  const [extendLoaded,setExtendLoaded] = useState(false)
  const addWarrantyToClient = useStore((store) => store.addWarrantyToClient);
  const extendedWarrantyAdded = useStore((store) => store.extendedWarrantyAdded);
  const [currentButtonText, setCurrentButtonText] = useState('Add to Cart');
  const [error, showError] = useState(false);
  const isMobileBelow = useMediaQuery({ query: '(max-width: 800px)' });

  const hanldeActiveButton = (index) => {
    setActiveButton(index);
    setActiveAddToCart(true);
    showError(false);
  };

  const handleTerm = (term) => {
    if (term === 12) {
      return '1 Year';
    } if (term === 24) {
      return '2 Years';
    } if (term === 36) {
      return '3 Years';
    } if (term === 48) {
      return '4 Years';
    }
  };


  const handleWarranty = () => {
    if (activeAddToCart) {
      showError(false);
      setCurrentButtonText('Adding...');
      const getCurrentWarranty = warranty.warrantyData[activeButton - 1];
      if (getCurrentWarranty) {
        addWarrantyToClient(getCurrentWarranty.code, warranty.qtyAdded, 'warranty', getCurrentWarranty.warrantySku).then((response) => {
          if (response.status === 200) {
            setCurrentButtonText('Added');
            setTimeout(() => {
              handleWarrantySuccess(warranty);
            }, 1500);
          } else {
            setCurrentButtonText('Error');
            setTimeout(() => {
              handleWarrantySuccess(warranty);
            }, 1500);
          }
        });
      }
    } else {
      showError(true);
    }
  };

  const handleWarrantyPopUp = async () => {
    Extend?.learnMoreModal?.open({
      referenceId:  warranty.product.code,
    });

    let checkForExtend = setInterval(() => {
      let iframe = document.querySelector('#extend-learn-more-modal-iframe')
      if (iframe){
        iframe.style.zIndex = 20000
        clearInterval(checkForExtend)
      }

    }, 100);

    let timeout = setTimeout(() => {
      clearInterval(checkForExtend)
      
    }, 5000);
  };

  return (
    <div>
      <div className="inc_extened_warranty_title_block">
        <div className="inc_extened_warranty_title">
          {warranty.product.name.replace('&#8482;', '®')}
        </div>
        {isMobileBelow == false ? (
          <div className="d-flex flex-column productAddToCartModal_btn-wrapper__w0aUf"><button onClick={() => handleWarranty()} type="button" aria-hidden="false" data-testid="pdc-btn-addtocart" className="bButton_btn__fDFiZ undefined undefined  undefined  btn btn-primary">{currentButtonText}</button></div>
        )
          : null}
      </div>
      <div className="productAddToCartModal_cart-items-bg-wrapper___dzle">
        <div className="productAddToCartModal_cart-items-list__OhK_J">
          <div className="d-flex flex-wrap productAddToCartModal_cart-item__rmiyD">
            <div className="text-center productAddToCartModal_image-wrapper__hvLTa"><img alt="Protect Your Purchase E2E" data-testid="pdc-img-extendicon" className="undefined img-fluid" src="https://source.widen.net/content/7p48xbp8kc/png/extend_icon_new.png?keep=c&quality=100&u=giheaf&w=198&h=248&retina=true" /></div>
            <div className="productAddToCartModal_content-wrapper__EFYzh">
              <div className="productAddToCartModal_title__b_per">Protect Your Purchase</div>
              <div className="productAddToCartModal_meta-wrapper__3o_uX">
                Add product protection offered by Extend

              </div>
              <button onClick={handleWarrantyPopUp} type="button" aria-hidden="false" data-testid="pdc-btn-whatscovered" className="bButton_btn__fDFiZ undefined undefined  undefined bButton_font-14__8dp2L  btn btn-link">What's covered?</button>
            </div>
          </div>
        </div>
      </div>
      <div className="productAddToCartModal_content-btn-wrapper__OGExF">
        {warranty.warrantyData.map((item, index) => (
          item.planType != 'replaced'
            ? (
              <button onClick={() => hanldeActiveButton(index + 1)} type="button" aria-hidden="false" data-testid="pdc-btn-1yearoffer" className={`bButton_btn__fDFiZ undefined undefined  bButton_font-14__8dp2L  ${activeButton === index + 1 ? 'btn btn-primary' : 'btn btn-secondary'}`}>
                {handleTerm(item.term)}
                {' '}
                -
                {' '}
                {formatter.format(item.price)}
              </button>
            )
            : null
        ))}
      </div>
      {isMobileBelow ? (
        <div className="d-flex flex-column productAddToCartModal_btn-wrapper__w0aUf"><button onClick={() => handleWarranty()} type="button" aria-hidden="false" data-testid="pdc-btn-addtocart" className="bButton_btn__fDFiZ undefined undefined  undefined  btn btn-primary">{currentButtonText}</button></div>
      )
        : null}

      { }
      {error && <div className="inc_warranty_error">Please select at least one option</div>}
    </div>
  );
}

export default ExtendedWarrantySidebar;
