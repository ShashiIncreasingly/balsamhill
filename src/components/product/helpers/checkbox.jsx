import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useStore from '../../../zustand/store';

function CheckBox({ productObject, handleCart }) {
  const removeFromStore = useStore((store) => store.removeFromStore);
  const addedProductIds = useStore((store) => store.addedProductIds);
  const sidebarLoading = useStore((store) => store.sidebarLoading);
  const [alwayChecked, setAlwaysChecked] = useState(false)
  // Keep it checked if sidebar open

  useEffect(() => {
    if (sidebarLoading === 'Success') {
      setAlwaysChecked(true)
    }
  }, [sidebarLoading]);


  if (addedProductIds.includes(productObject.ProductId)) {
    return <button aria-label="Remove" type="button" onClick={() => removeFromStore(productObject.ProductId)} className={`inc_product_add_checkbox_img ${addedProductIds.includes(productObject.ProductId) ? 'checked' : 'uncheked'}`} />
  }
  return (
    <button aria-label="Add" type="button" onClick={() => handleCart(null, null, null, 'action')} className={`inc_product_add_checkbox_img ${addedProductIds.includes(productObject.ProductId) ? 'checked' : 'uncheked'}`} />
  );
}
CheckBox.propTypes = {
  handleCart: PropTypes.func.isRequired,
  productObject: PropTypes.object.isRequired,
  addedProductIds: PropTypes.array,
};

export default CheckBox;
