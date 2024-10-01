import { useEffect, useRef, useState } from 'react';
import './popup.scss';
const ExtendedWarrantyPopup = ({ state }) => {
    const modalRef = useRef(null);
    const buttonRef = useRef(null)
    const [isOpen, setIsOpen] = useState(state);
    const handleclosePopUp = (e) => {

        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setIsOpen(false)
        }
    };

    const handleInsideClick = (event) => {
        if (event.target !== buttonRef) {
            event.stopPropagation();

        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleclosePopUp);
        } else {
            document.removeEventListener('mousedown', handleclosePopUp);
        }

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleclosePopUp);
        };
    }, [isOpen]);




    // handleclosePopUp
    return (
        <div>
            {isOpen && (
                <div className="inc_warranty_popup"    >


                    <div className='inc_overlay' style={{ background: '#000', opacity: '0.5', height: '100vh', width: '100vw', zIndex: 12000, position: 'fixed', top: 0, left: 0, }}></div>
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="fade full-view-modal-sm  modalContainer_full-view-modal-sm__Y0L8R modalContainer_modal-without-title__VVbBl modal show"
                        tabIndex={-1}
                        style={{ display: "block" }}

                    >
                        <div className="modal-dialog modalContainer_modal-dialog__h6Pu2 modal-lg modal-dialog-centered" ref={modalRef} onClick={(event) => handleInsideClick(event)}>
                            <div className="modal-content modalContainer_modal-content__HIS3P"
                            >
                                <div className="modal-header border-bottom-0 p-0">
                                    <button
                                        type="button"
                                        aria-label="Close Dialog"
                                        className="bButton_btn__fDFiZ undefined p-0 btn-close modalContainer_btn-close__yrLHg  undefined  btn btn-link"
                                        onClick={() => setIsOpen(false)}

                                    />
                                </div>
                                <div className="modalContainer_modal-body__UNKYf modal-body">
                                    <div className="productWhatsCoveredModal_product-whats-covered-wrapper__lNXrH">
                                        <div className="row">
                                            <div className="col-12 productWhatsCoveredModal_col-text__TV_2E">
                                                <div className="d-flex align-items-center flex-wrap undefined">
                                                    <img
                                                        width={76}
                                                        height={80}
                                                        alt="Keep your product protected after the manufacturer warranty expires with a plan from Extend."
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="undefined img-fluid"
                                                        src="https://source.widen.net/content/7p48xbp8kc/jpeg/extend_icon_new.jpeg?w=198&h=248&keep=c&crop=yes&color=ffffff&quality=80&u=giheaf"
                                                    />
                                                    <span
                                                        className="balsam-icon-plus ms-3 me-3"
                                                        aria-hidden="true"
                                                    />
                                                    <img
                                                        alt="Keep your product protected after the manufacturer warranty expires with a plan from Extend."
                                                        width={192}
                                                        height={29}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="undefined img-fluid"
                                                        src="https://images.contentstack.io/v3/assets/blt4fe90c223711404f/blt6f732d928ae4e37c/62c54c5b30ed0e3641c60a7b/balsamhilllogo.png"
                                                    />
                                                </div>
                                                <div>
                                                    <h2 className="h4 productWhatsCoveredModal_heading__6Wj7L">
                                                        Keep your product protected after the manufacturer warranty
                                                        expires with a plan from Extend.
                                                    </h2>
                                                    <div>
                                                        <strong>This Plan covers:</strong>
                                                    </div>
                                                    <ul className="productWhatsCoveredModal_list-text__NGshX">
                                                        <li className="productWhatsCoveredModal_list-item__FUAYk">
                                                            Hassel-free replacements
                                                        </li>
                                                        <li className="productWhatsCoveredModal_list-item__FUAYk">
                                                            Extended failure protection
                                                        </li>
                                                        <li className="productWhatsCoveredModal_list-item__FUAYk">
                                                            Peace of mind when using your protect
                                                        </li>
                                                    </ul>
                                                    <a
                                                        href="https://customers.extend.com/en-US/plan_details/10001-balsamhill-base-repair-1y?storeId=de15dc4d-ccb3-4e45-9a44-528ca16ce447"
                                                        target="_blank"
                                                        rel="noreferrer undefined"
                                                        className="btn btn-link bLink_btn__68_bO bLink_btn-link__Lddnw bLink_external-link__UH010 productWhatsCoveredModal_plan-link-btn__jnbA1  undefined "
                                                        aria-label=" Plan details &amp; FAQ. Opens another site in a new window"
                                                    >
                                                        <span className="bLink_external-link-text__WX8F3">
                                                            <span className="productWhatsCoveredModal_plan-link-text__DeKzD">
                                                                Plan details &amp; FAQ
                                                            </span>
                                                        </span>
                                                    </a>
                                                    <div className="productWhatsCoveredModal_choose-header__ZOWEw" />
                                                    <div className="row undefined" />
                                                </div>
                                            </div>
                                            <div className="d-none d-sm-block col-12 productWhatsCoveredModal_col-img__dHuN7">
                                                <div className="w-100 h-100 position-relative">
                                                    <div
                                                        className="productWhatsCoveredModal_whats-covered-col-img__qDP4G"
                                                        aria-label="What's Covered"
                                                        style={{
                                                            backgroundImage:
                                                                'url("https://s3.amazonaws.com/ccspersistenceprod-contentstaticassets04b201d4-1apqb8dyegznm/offers/learnMoreModal-default-1654273197988-learnMoreModal.backgroundImageUrl_Generic_WomanwithBox2.jpg")'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default ExtendedWarrantyPopup;
