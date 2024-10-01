import PropTypes from 'prop-types';
import './App.css';
import React, { useEffect } from 'react';
import { checkPreviewMode, countryByName } from './lib/helpers';
import ProductPage from './pages/ProductPage';
import ProductList from './pages/ProductListPage';
import CartPage from './pages/CartPage';

function App({ pageType, pageConfigs }) {
  useEffect(() => {
    if (pageType === 'ProductPage') {
      localStorage.removeItem('selected_itemid');
    }
  }, [pageType]);

  switch (pageType) {
    case 'ProductPage':
      return <ProductPage />;

    case 'CartPage':
      return countryByName() !== 'United States' ? <CartPage pageConfigs={pageConfigs} /> : null;

    case 'ProductList':
      return checkPreviewMode() ? <ProductList /> : null;

    default:
      return null;
  }
}

App.propTypes = {
  pageType: PropTypes.string.isRequired,
  pageConfigs: PropTypes.object,
};

export default App;
