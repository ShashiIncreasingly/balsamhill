import { bundleViewTracking } from '@/api/tracking';
import Cart from '@/components/cart';
import Product from '@/components/product';
import useStore from '@/zustand/store';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation } from 'swiper/swiper.esm.js';
import 'swiper/swiper.min.css';

function FBT({ bundles }) {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1279px)' });
  const isMobileBelow = useMediaQuery({ query: '(max-width: 800px)' });

  const [bundleIds, setBundleIds] = useState({});

  const isMobileOpen = useStore((store) => store.isMobileOpen);
  const bundleAvalaible = useStore((store) => store.bundleAvalaible);



  const [hideFBT, setHideFBT] = useState(true);

  const handleMiniBundle = (image, idx) => {
  };

  const handleBundleIds = () => {
    const BundlesMapToIds = {};
    bundles.Bundles.map((bundle, index) => {
      if (index === 1) {
        BundlesMapToIds[bundle.ProductIds[0]] = bundle.BundleId;
        BundlesMapToIds[bundle.ProductIds[1]] = bundle.BundleId;
      } else {
        BundlesMapToIds[bundle.ProductIds[1]] = bundle.BundleId;
      }
    });
    setBundleIds(BundlesMapToIds);
  };

  const [ref, inView] = useInView({
    /* Optional options */
    triggerOnce: true,
    rootMargin: '0px 0px',
  });

  useEffect(() => {
    if (inView) {
      bundleViewTracking();
    }
  }, [inView]);

  useEffect(() => {
    handleBundleIds();
    const clientElement = document.querySelector('.bButton_btn__fDFiZ.d-block.productDetailContainer_btn-notify-add__gBYP_.w-100');
    if (clientElement) {
      if (clientElement.innerText === 'Notify Me') {
        setHideFBT(true);
        if (document.querySelector('#inc_pdp_2').parentElement) {
          if (document.querySelector('#inc_pdp_2').parentElement.parentElement) {
            document.querySelector('#inc_pdp_2').parentElement.parentElement.style.setProperty("display", "none", "important");
          }
        }

        // oosproduct(bundles.ProductsDetail[0].ProductId);
      } else {
        setHideFBT(false);
        if (document.querySelector('#inc_pdp_2').parentElement) {
          if (document.querySelector('#inc_pdp_2').parentElement.parentElement) {
            document.querySelector('#inc_pdp_2').parentElement.parentElement.style.setProperty("display", "block", "important");
          }
        }
      }
    } else {
      setHideFBT(false);
      if (document.querySelector('#inc_pdp_2').parentElement) {
        if (document.querySelector('#inc_pdp_2').parentElement.parentElement) {
          document.querySelector('#inc_pdp_2').parentElement.parentElement.style.setProperty("display", "block", "important");
        }
      }
    }
    document.querySelector('html').classList.add('inc_fbt_avl');
    const clientATC = document.querySelector('.productDetailContainer_product-filter-wrapper___kJ9O');
    if (clientATC) {
      clientATC.addEventListener('click', () => {
        setTimeout(() => {
          if (clientElement) {
            if (clientElement.innerText === 'Notify Me') {
              setHideFBT(true);
              if (document.querySelector('#inc_pdp_2').parentElement) {
                if (document.querySelector('#inc_pdp_2').parentElement.parentElement) {
                  document.querySelector('#inc_pdp_2').parentElement.parentElement.style.setProperty("display", "none", "important");
                }
              }

              // oosproduct(bundles.ProductsDetail[0].ProductId);
            } else {
              setHideFBT(false);
              if (document.querySelector('#inc_pdp_2').parentElement) {
                if (document.querySelector('#inc_pdp_2').parentElement.parentElement) {
                  document.querySelector('#inc_pdp_2').parentElement.parentElement.style.setProperty("display", "block", "important");
                }
              }
            }
          }
        }, 500);
      });
    }

  }, []);

  if (!bundleAvalaible) {
    return null;
  }

  useEffect(() => {
    if (bundleAvalaible) {
      setTimeout(() => {
        const firstTwoChecked = document.querySelectorAll('.inc_pdp_bundle_product_block .inc_product_add_checkbox_img.checked');
        for (let i = 0; i < firstTwoChecked.length; i += 1) {
          if (i < 2) {
            if (firstTwoChecked[i]) {
              firstTwoChecked[i].click();
            }
          }
        }
        setTimeout(() => {
          const firstTwoUnchecked = document.querySelectorAll('.inc_pdp_bundle_product_block .inc_product_add_checkbox_img.uncheked');
          for (let i = 0; i < firstTwoUnchecked.length; i += 1) {
            if (i < 2) {
              if (firstTwoUnchecked[i]) {
                firstTwoUnchecked[i].click();
              }
            }
          }
        }, 200);
      }, 200);
    }
  }, [bundleAvalaible]);


  if (!document.querySelector('#inc_pdp_2')) return
  return (
    <>
      {/* FBT */}
      <div ref={ref} className={`inc_pdp_block ${isMobileOpen && 'incActive'} ${bundles.ProductsDetail.length - 1 === 1 ? 'inc_count_1' : ''} ${hideFBT && 'inc_hide_oos'}`} tabIndex="0" >
        {/* Title Block */}
        <div className="inc_pdp_title_block">
          <div className="inc_pdp_title_text_block">
            {/* <div className="inc_pdp_title_text">Frequently Bought Together</div> */}
          </div>
        </div>

        {/* Bundle Section */}
        <div className="inc_pdp_bundle_block">
          {/* Load First Product */}

          {/* Mobile Layout */}
          <div className="inc_img_together_block">
            {isMobileBelow && !isMobileOpen
              && bundleAvalaible.map((product, idx) => {
                if (idx === 0) {
                  return (

                    <div className="inc_main_img_block">
                      <a href={product.ProductUrl}>
                        <img alt={product.ProductName} src={product.ImageURL} />
                      </a>
                    </div>
                  );
                }
                return (
                  <>
                    <div className="inc_plus_icon" />
                    <div className="inc_goes_img_block">
                      <a href={product.ProductUrl}>
                        <img alt={product.ProductName} src={product.ImageURL} />
                      </a>
                    </div>
                  </>

                );
              })}
          </div>
          <Product setHideFBT={setHideFBT} key={bundles.ProductsDetail[0].ProductId} data-id={bundles.ProductsDetail[0].ProductId} type="pdp" blockType="main" productObject={bundles.ProductsDetail[0]} main handleMiniBundle={handleMiniBundle} />

          {/* Plus Icon */}
          <div className="inc_pdp_icon-add_block"><div className="inc_pdp_icon-add_img_block" /></div>

          {/* Swiper Carousel */}
          <div className="inc_pdp_bundle_product_block">
            {/* Left Navigation */}
            {isMobileBelow ? (
              <div>
                {bundles.ProductsDetail
                  && bundles.ProductsDetail.slice(1, 3).map(
                    (product, idx) => (
                      <Product type="pdp" key={product.ProductId} productObject={product} main={false} idx={idx} handleMiniBundle={handleMiniBundle} uniqueType="000" />
                    ),
                  )}
              </div>
            ) : (
              <>
                {bundles.ProductsDetail.length == 2 ? (
                  <>
                    {bundles.ProductsDetail
                      && bundles.ProductsDetail.slice(1).map(
                        (product) => (

                          <Product key={product.ProductId} type="pdp" productObject={product} main={false} bundleIds={bundleIds} uniqueType="000" />
                        ),
                      )}

                  </>

                ) : (
                  <>
                    <div className="inc_pdp_bundle_nav_left" ref={(node) => setPrevEl(node)} />
                    <Swiper
                      spaceBetween={10}
                      modules={[Navigation]}
                      slidesPerView={isTabletOrMobile ? 1 : 2}
                      allowTouchMove={false}
                      navigation={{ prevEl, nextEl, disabledClass: 'inc_disabled' }}
                      draggable
                    >
                      {bundles.ProductsDetail
                        && bundles.ProductsDetail.slice(1).map(
                          (product) => (
                            <SwiperSlide key={product.ProductId}>
                              <Product key={product.ProductId} type="pdp" productObject={product} main={false} bundleIds={bundleIds} uniqueType="000" />
                            </SwiperSlide>
                          ),
                        )}
                    </Swiper>
                    {/* Right Navigation */}
                    <div className="inc_pdp_bundle_nav_right" ref={(node) => setNextEl(node)} />
                  </>
                )}

              </>
            )}

          </div>

          {/* Cart Block */}
          <Cart />
        </div>
      </div>
    </>
  );
}

FBT.propTypes = {
  bundles: PropTypes.object.isRequired,
  main: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default FBT;
