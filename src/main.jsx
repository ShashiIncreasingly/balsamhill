/* eslint-disable no-case-declarations */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { addVisitorID, insertAfter } from './lib/helpers';

const pageConfigs = { pageType: 'ProductPage' };

function getPageType() {
  const { pathname } = window.location;
  if (pathname === '/') return 'HomePage';
  if (pathname === '/cart') return 'CartPage';
  if (pathname.includes('/p/') || pathname.includes('/f/')) return 'ProductPage';
  if (pathname.includes('/c/')) return 'ProductList';
  if (pathname.includes('/search')) return 'SearchPage';
  if (pathname.includes('/inspiration')) return 'ContentPage';
  return false;
}
if (window.location.href.includes('balsamhill.ca/')) {
  document.querySelector('html').classList.add('ca_bundles');
}
const pageType = getPageType();

const hideParent = (selector) => {
  const element = document.querySelector(selector);
  if (element?.parentElement?.parentElement) {
    element.parentElement.parentElement.style.setProperty('display', 'none', 'important');
  }
};
const createRoot = (selector, rootId) => {
  const parentElement = document.querySelector(selector);
  if (parentElement) {
    const existingRoot = parentElement.querySelector(`#${rootId}`);
    if (existingRoot) existingRoot.remove();

    const newRoot = document.createElement('div');
    newRoot.id = rootId;
    parentElement.appendChild(newRoot);
    return true;
  }
  return false;
};
const createIncreasinglyRoot = () => {
  switch (pageType) {
    case 'ProductPage':
      hideParent('#inc_pdp_1');
      hideParent('#inc_pdp_2');
      if (createRoot('#inc_pdp_2', 'increasingly_root')) return true;
      if (createRoot('#inc_pdp_3', 'increasingly_root')) return true;
      if (createRoot('#inc_pdp_1', 'increasingly_root')) return true;

      const newRoot = document.createElement('div');
      newRoot.id = 'increasingly_root';
      document.body.appendChild(newRoot);
      return true;

    case 'CartPage':
      hideParent('#inc_cart_1');
      hideParent('#inc_empty_cart_1');
      hideParent('#inc_empty_cart_2');
      if (createRoot('#inc_cart_1', 'increasingly_root')) return true;
      if (createRoot('#inc_empty_cart_1', 'increasingly_root')) return true;

      break;

    case 'ProductList':
      hideParent('#inc_plp_1');
      if (createRoot('#inc_plp_1', 'increasingly_root')) return true;
      if (createRoot('#inc_plp_2', 'increasingly_root')) return true;

      break;

    case 'HomePage':
      const nextSibling = document.querySelector('#inc_home_page_1')?.parentElement?.nextElementSibling;
      if (nextSibling) nextSibling.style.display = 'none';

      break;

    default:
      return false;
  }
};

const recheckIncFile = () => {
  const incRootN = document.getElementById('increasingly_root');
  if (incRootN != null) {
    const rootN = ReactDOM.createRoot(incRootN);
    rootN.render(
      <React.StrictMode>
        <App pageType={pageType} pageConfigs={pageConfigs} />
      </React.StrictMode>,
    );
  }
};
if (pageType) {
  if (createIncreasinglyRoot()) {
    addVisitorID();
    const incRoot = document.getElementById('increasingly_root');
    const renderApp = () => {
      const root = ReactDOM.createRoot(incRoot);
      root.render(
        <React.StrictMode>
          <App pageType={pageType} pageConfigs={pageConfigs} />
        </React.StrictMode>
      );
    };

    const checkAndRecheck = (delay) => {
      setTimeout(() => {
        if (!document.getElementById('increasingly_root') && !document.querySelector('.increasingly_root') && getPageType() === "CartPage") {
          if (createIncreasinglyRoot()) {
            recheckIncFile();
          }
        }
      }, delay);
    };

    if (incRoot != null) {
      renderApp();
      checkAndRecheck(4000); // First delay
      checkAndRecheck(8500); // Second delay (4500ms after first)
      checkAndRecheck(9500); // Third delay (1000ms after second)
    } else {
      checkAndRecheck(4000);
      checkAndRecheck(8500);
      checkAndRecheck(9500);
    }
  }
}