import { formatter } from '@/lib/helpers';
import useStore from '@/zustand/store';
import { useEffect, useState } from 'react';

function ExtendedWarranty({ warrantyResponse, qty }) {
  const [activeButton, setActiveButton] = useState(false);
  const [activeAddToCart, setActiveAddToCart] = useState(false);
  const [extendLoaded, setExtendLoaded] = useState(false)
  const extendedWarranty = useStore((store) => store.extendedWarranty);
  const addWarrantyToClient = useStore((store) => store.addWarrantyToClient);
  const extendedWarrantyAdded = useStore((store) => store.extendedWarrantyAdded);


  const [buttonText, setButtonText] = useState('Add to Cart')

  const hanldeActiveButton = (index) => {
    setActiveButton(index);
    setActiveAddToCart(true);
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
    // setButtonText('Adding..')
    const getCurrentWarranty = warrantyResponse[activeButton - 1];
    if (getCurrentWarranty) {
      addWarrantyToClient(getCurrentWarranty.code, qty, 'warranty', getCurrentWarranty.warrantySku);
    }
  };

  useEffect(() => {
    if (extendedWarrantyAdded) {
      // setButtonText('Added')
      const params = new URLSearchParams(window.location.search)
      if (params && params?.get("asm") === "true") {
        window.location.href = '/cart?asm=true'

      } else {
        window.location.href = '/cart'
      }
    }
  }, [extendedWarrantyAdded]);


  const handleWarrantyPopUp = async () => {
    Extend?.learnMoreModal?.open({
      referenceId: warrantyResponse[0].warrantySku,
    });


    let checkForExtend = setInterval(() => {
      let iframe = document.querySelector('#extend-learn-more-modal-iframe')
      if (iframe) {
        iframe.style.zIndex = 20000
        clearInterval(checkForExtend)
      }
    }, 100);

    let timeout = setTimeout(() => {
      clearInterval(checkForExtend)
    }, 5000);
  };

  return (
      <div class="productAddToCartModal_cart-items-bg-wrapper__PUb66">
        <div class="productAddToCartModal_cart-items-list__4R0Iy">
          <div class="d-flex flex-wrap productAddToCartModal_cart-item__XayMA">
            <div class="text-center productAddToCartModal_image-wrapper__YbdMM"><img alt="Protect Your Purchase (Not available in Canada and Puerto Rico)" data-testid="pdc-img-extendicon" class="undefined img-fluid" src="https://source.widen.net/content/7p48xbp8kc/png/extend_icon_new.png?keep=c&amp;quality=100&amp;u=giheaf&amp;w=176&amp;h=220" loading="lazy" decoding="async" width="176" height="220" /></div>
            <div class="productAddToCartModal_content-wrapper__sOX81">
              <div class="productAddToCartModal_title__P67IJ">Protect Your Purchase (Not available in Canada and Puerto Rico)</div>
              <div class="mt-2 productAddToCartModal_meta-wrapper__oQLo9">
                <div class="w-100 productAddToCartModal_protection-plan-content__z46Zu">Add product protection offered by Extend </div>
                <div><button type="button" data-testid="pdc-btn-whatscovered" class="bButton_btn__6AYp1 undefined undefined d-inline text-start  undefined  btn btn-link" onClick={handleWarrantyPopUp}>What's covered?</button></div>
              </div>
              <div class="d-none d-md-flex flex-wrap productAddToCartModal_content-btn-wrapper__w3aVh">
                {warrantyResponse.map((item, index) => (
                  item.planType != "replaced"
                    ? (<div className="productAddToCartModal_content-btn-cell-wrapper__BwZ9a"><button onClick={() => hanldeActiveButton(index + 1)} type="button" aria-hidden="false" data-testid="pdc-btn-1yearoffer" className={`bButton_btn__6AYp1 undefined h-100 productAddToCartModal_warranty-plan-btn-wrapper__ieKql  undefined  ${activeButton === index + 1 ? 'btn btn-primary' : 'btn btn-secondary'}`}>
                      {handleTerm(item.term)}
                      {' '}
                      -
                      {' '}
                      <span aria-label={formatter.format(item.price)}> {formatter.format(item.price)}</span>
                    </button></div>)
                    : null
                ))}

              </div>
            </div>
            <div class="d-block d-md-none productAddToCartModal_mobile-content-btn-wrapper___FUnW">
              <div class="d-flex flex-wrap productAddToCartModal_content-btn-wrapper__w3aVh">

                {warrantyResponse.map((item, index) => (
                  item.planType != "replaced"
                    ? (<div className='productAddToCartModal_content-btn-cell-wrapper__BwZ9a'><button onClick={() => hanldeActiveButton(index + 1)} type="button" aria-hidden="false" data-testid="pdc-btn-1yearoffer" className={`bButton_btn__6AYp1 undefined h-100 productAddToCartModal_warranty-plan-btn-wrapper__ieKql  undefined  btn  ${activeButton === index + 1 ? 'btn btn-primary' : 'btn btn-secondary'}`} >
                      {handleTerm(item.term)}
                      {' '}
                      -
                      {' '}
                      <span> aria-label={formatter.format(item.price)}{formatter.format(item.price)}</span>

                    </button></div>)
                    : null
                ))}

              </div>
            </div>
            <div class="d-flex flex-column align-items-center align-items-md-end productAddToCartModal_btn-wrapper__Effxg"><button onClick={() => handleWarranty()} type="button" data-testid="pdc-btn-addtocart" class="bButton_btn__6AYp1 undefined undefined  undefined  btn btn-primary">{buttonText}</button></div>
          </div>
        </div>
      </div>
  );
}

export default ExtendedWarranty;
