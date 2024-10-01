import uniq from 'lodash/uniq';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { handleFallbackImage } from '../../lib/helpers';
import './gallery.scss';

function GalleryListItem({
  image,
  index,
  setMainImage,
  handleClick,
  setGalleryCount,
  imagesGallery,
  mainImage,
  ProductName,
  mainProductid,
}) {
  const ref = useRef(null);
  const updateImage = (currentImage) => {
    setMainImage(currentImage);
    handleClick(ref);
    const findImage = imagesGallery.indexOf(currentImage);
    setGalleryCount(findImage + 1);
  };

  useEffect(() => {
    if (mainImage.split('?')[0] === image.split('?')[0]) {
      handleClick(ref);
    }
  }, [mainImage]);

  return (
    <div key={index} role="button" onClick={() => updateImage(image)} onKeyDown={() => updateImage(image)} tabIndex={0}>
      <img onError={(e) => handleFallbackImage(e)} ref={ref} className={`inc_product_image_gallery_list_item ${image.split('?')[0] === mainImage.split('?')[0] ? 'active' : ''}`} src={image} alt={ProductName} aria-label="Image" />
    </div>
  );
}



function Gallery({
  images, activeMainImage, ProductId, ProductUrl, pageTypeId, pageTid, sendClickTrackDelayed, priorityType, ProductName, mainProductid,
}) {
  const [mainImage, setMainImage] = useState(activeMainImage);
  const [imagesGallery, setImagesGallery] = useState(images || []);
  const [galleryCount, setGalleryCount] = useState(1);
  const isMobileBelow = useMediaQuery({ query: '(max-width: 800px)' });
  const imageCount = imagesGallery.length;
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;


  const showPrev = () => {
    let findImage = imagesGallery.indexOf(mainImage);
    if (findImage === 0) findImage = imagesGallery.length;
    if (findImage === -1) findImage = imagesGallery.length;
    setMainImage(imagesGallery[findImage - 1]);
    setGalleryCount(findImage);
  };

  const showNext = () => {
    let findImage = imagesGallery.indexOf(mainImage);
    if (findImage === imagesGallery.length - 1) findImage = -1;
    setMainImage(imagesGallery[findImage + 1]);
    setGalleryCount(findImage + 2);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe) {
      if (isLeftSwipe) {
        showNext();
      } else {
        showPrev();
      }
    }
    // add your conditional logic here
  };

  const handleClick = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  useEffect(() => {
    setMainImage(activeMainImage);
    const findImage = imagesGallery.find((image) => image === activeMainImage);
    if (!findImage) {
      const newGallery = uniq([activeMainImage, ...imagesGallery]);
      setImagesGallery([...newGallery]);
    } else {
      const updatedimagesGallery = imagesGallery.filter((image) => image !== activeMainImage);
      const newGallery = uniq([activeMainImage, ...updatedimagesGallery]);

      setImagesGallery([...newGallery]);
    }
  }, [activeMainImage]);

  return (
    <div className="inc_product_image_gallery">
      {imagesGallery.length > 1 && (
        <div className="inc_product_image_gallery_block">

          {!isMobileBelow && galleryCount !== 1 && imageCount > 8 && <div role="button" aria-label="Previous" tabIndex={0} className="inc_product_active_gallery_left vertical_left" onClick={() => showPrev()} onKeyDown={() => showPrev()} />}
          {imagesGallery.length > 1 && imagesGallery.map((image, index) => (
            <GalleryListItem
              key={index}
              index={index}
              image={image}
              setMainImage={setMainImage}
              handleClick={handleClick}
              setGalleryCount={setGalleryCount}
              imagesGallery={imagesGallery}
              mainImage={mainImage}
              pageTypeId={pageTypeId}
              pageTid={pageTid}
              ProductName={ProductName}
              mainProductid={mainProductid}
            />
          ))}
          {!isMobileBelow && galleryCount !== imageCount && imageCount > 8 && <div role="button" tabIndex={0} aria-label="Next" className="inc_product_active_gallery_right vertical_right" onClick={() => showNext()} onKeyDown={() => showNext()} />}
        </div>
      )}

      <div className="inc_product_active_gallery_block">
        {imagesGallery.length > 1 && <div className="inc_product_active_gallery_left" onClick={() => showPrev()} onKeyDown={() => showPrev()} role="button" tabIndex={0} aria-label="Next" />}
        <a href={ProductUrl } onClick={(e) => e.preventDefault()} alt={ProductName} aria-label={ProductName}>
          <img onClick={() => sendClickTrackDelayed(ProductId, priorityType, pageTypeId, pageTid, mainProductid)} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{ touchAction: 'pan-y', maxWidth: '600px' }} onError={(e) => handleFallbackImage(e)} src={mainImage} alt={ProductName} aria-label="Image" className="inc_product_active_image_gallery" />
        </a>
        {imagesGallery.length > 1 && <div className="inc_product_active_gallery_right" role="button" onClick={() => showNext()} onKeyDown={() => showNext()} aria-label="Previous" tabIndex={0} />}
        <div className="inc_product_image_gallery_count">{`${galleryCount} / ${imageCount}`}</div>
      </div>

    </div>
  );
}

Gallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])),
  activeMainImage: PropTypes.string.isRequired,
  ProductId: PropTypes.string.isRequired,
};

Gallery.defaultProps = {
  images: [],
};
GalleryListItem.propTypes = {
  image: PropTypes.string.isRequired,
  setMainImage: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  setGalleryCount: PropTypes.func.isRequired,
  imagesGallery: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string])).isRequired,
  mainImage: PropTypes.string.isRequired,
};

export default React.memo(Gallery);
