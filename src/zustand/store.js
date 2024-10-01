/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-self-compare */
/* eslint-disable max-len */
import Product from '@/components/product';
import { checkForAsmUrlEnable, getUserType, loadScript } from '@/lib/helpers';
import create from 'zustand';

function currencyCheck() {
  let currency = "EUR"
  let priceCheck1 = document.querySelector('.productPrice_new-price__tLgIi')
  if (priceCheck1) {
    if (priceCheck1.textContent.includes('£')) {
      currency = "GBP"
    }
  } else if (localStorage.getItem('selectedCurrency')) {
    let parsed = JSON.parse(localStorage.getItem('selectedCurrency'))
    currency = parsed.isocode

  } else if (document.querySelector('script[data-sdk-integration-source="react-paypal-js"]')) {

    if (document.querySelector('script[data-sdk-integration-source="react-paypal-js"]').src.includes('GBP')) {
      currency = "GBP"
    }

  } else if (document.querySelector('.productCard_prod-sale-price__KB_Tq')) {
    if (document.querySelector('.productCard_prod-sale-price__KB_Tq').textContent.includes('£')) {
      currency = "GBP"
    }
  }
 
  return currency
}

function getCountryCodeLocal() {
  function readIVID(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (const s in ca) {
      if (Object.prototype.hasOwnProperty.call(ca, s)) {
        let c = ca[s];
        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
          return c.substring(nameEQ.length, c.length);
        }
      }
    }
    return null;
  }
  


  if (window.location.host === 'www.balsamhill.co.uk') {
    let value = 'b58luk';

    if (currencyCheck() === "EUR") {
      value = 'b58leuro';
    }

    return value;
  }
  if (window.location.host === 'www.balsamhill.com') {
    return 'b58lus';
  }
  if (window.location.host === 'www.balsamhill.ca') {
    return 'b58lca';
  }
  if (window.location.host === 'www.balsamhill.com.au') {
    return 'b58lau';
  }

  if (window.location.host === 'uat-ui.i.balsamhill.co.uk') {
    let value = 'b17s0mReQ6UK';

    if (currencyCheck() === "EUR") {
      value = 'b15eUroUK';
    }

    return value;
  }
  if (window.location.host === 'uat-ui.i.balsamhill.com.au') {
    return 'b17s0mReQ6AU';
  }
  if (window.location.host === 'uat-ui.i.balsamhill.com') {
    return 'b17s0mReQ6';
  }
  if (window.location.host === 'uat-ui.i.balsamhill.ca') {
    return 'b17s0mReQ6CA';
  }

  return null;
}

export const clientConfig = {
  client_id: getCountryCodeLocal(),
  no_image: 'https://www.increasingly.co/Implementation/b58luk/images/inc_noimage.png',
  outOfStock: false,
  recsProductIds: [],
  recsExist: false,
  dbProducts: 0,
  extendEnvironment: window.location.href.includes('uat') ? 'demo' : 'production',
  extendScript: 'https://sdk.helloextend.com/extend-sdk-client/v1/extend-sdk-client.min.js',
  extendStoreId: window.location.href.includes('uat') ? '61a11a88-a104-46fb-bbe2-f3b86dcef3d1' : 'de15dc4d-ccb3-4e45-9a44-528ca16ce447',
};

const useStore = create((set, get) => ({
  bundles: {},
  recommendation: {},
  cartBundles: {},
  sidebarBundles: {},
  productListBundles: {},
  homePageBundles: {},
  newArrivalsBundles: {},
  bestSellers30DBundles: {},
  searchBundles: {},
  searchBestSellerBundles: {},
  cartPageRecommendationBundles: {},
  mostLovedBundles: {},
  moreToDiscoverBundles: {},
  bestSellersBundles: {},
  MostPopularTreesBundles: {},
  bestSellerLowPriceBundles: {},
  MostPopular: {},
  MostPopularBundles: {},
  cart: [],
  sidebarCart: [],
  recsCart: [],
  addedProductIds: [],
  total: {},
  recsProductIds: [],
  saved: 0,
  totalCartQuantity: 0,
  addToCartLoader: false,
  addToCartSingleLoader: false,
  addToCart: false,
  bundlesExist: false,
  sidebarExist: false,
  pageType: null,
  sidebarLoading: false,
  recsExist: false,
  productListExist: false,
  homePageExist: false,
  MostPopularExist: false,
  bestSellerLowPriceExist: false,
  newArrivalsExist: false,
  MostPopularTreesExist: false,
  searchBestSellerExist: false,
  bestSellersExist: false,
  cartPageRecommendationExist: false,
  mostLovedExist: false,
  searchExist: false,
  cartExist: false,
  isProduction: false,
  addedFrom: null,
  outOfStock: false,
  isMobileOpen: false,
  bundleAvalaible: [],
  sidebarOpen: false,
  currentAddToCartId: null,
  extendedWarranty: [],
  extendedWarrantyAdded: false,
  extendedWarrantyMultiple: [],
  clientAddToCartResponse: [],
  sidebarErrors: [],
  failedProductIDS: [],
  firstThreePDP: [],
  sidebarAddedProducts: [],
  currentURL: "",
  clientModalOpen: false,


  fetchBundle: async (url, type, cartIds) => {

    if (url === 'development') {
      if (type === 'pdp') {
        // This Section Is For Hardcoding During Local Development
        fetch('https://usaincreasingly.increasingly.co/Clients/balsam-vite/response.json')
          .then((response) => response.json())
          .then((data) => {
            set({
              bundles: data,
              bundlesExist: true,
              mainProduct: data.ProductsDetail[0],
              sidebarBundles: data,
              sidebarExist: true,
            });
            const preAddCount = 3;

            const imagesDetails = [];
            const firstThreePDPArray = [];
            for (let i = 0; i < preAddCount; i += 1) {
              if (data.ProductsDetail[0]) {
                // Price
                const product = data.ProductsDetail[i];
                product.Price = product.Attributes[0].attributeValues[0].childProductPrice;
                product.SpecialPrice = product.Attributes[0]
                  .attributeValues[0]
                  .childProductSpecialPrice;
                const { childProductId } = product.Attributes[0].attributeValues[0];
                get().addToStore(product, 1, childProductId);
                // const detailProduct = { product, childProductId };
                // firstThreePDPArray.push(detailProduct);

                imagesDetails.push(product);
              }
            }
            set({
              bundleAvalaible: [...imagesDetails],
              // firstThreePDP:[...firstThreePDPArray]
            });
          });

        fetch('https://usaincreasingly.increasingly.co/Clients/balsam-vite/cart.json')
          .then((response) => response.json())
          .then((data) => {
            set({
              recommendation: data,
              recsExist: true,
              recsProductIds: [...data.CategoryRecommendations.map((product) => product.ProductId)],
            });

            // Update Config
            clientConfig.recsExist = true;
            clientConfig.dbProducts = data.CategoryRecommendations.length;
          });

        return;
      }
      if (type === 'cart') {
        // This Section Is For Hardcoding During Local Development
        fetch('https://usaincreasingly.increasingly.co/Clients/balsam-vite/cart.json')
          .then((response) => response.json())
          .then((data) => {
            set({
              cartBundles: data,
              cartExist: true,
            });
          });

        return;
      }
      if (type === 'plp') {
        // This Section Is For Hardcoding During Local Development
        fetch('https://usaincreasingly.increasingly.co/Clients/balsam-vite/recs.json')
          .then((response) => response.json())
          .then((data) => {
            set({
              productListBundles: data,
              productListExist: true,

            });
          });

        return;
      }
    }

    // This Section Is For Production Data Flow.

    const myHeaders = new Headers();
    myHeaders.append('Origin', window.location.origin);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    if (type === 'sidebar') {
      set({ sidebarLoading: 'Started' });
    }

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((bundles) => {
        // Check IF Recs Or PDP
        if (type !== "pdp" && type !== "sidebar" && type !== 'cart') {
          if (bundles.CategoryRecommendations) {
            if (bundles.CategoryRecommendations.length > 10) {
              bundles.CategoryRecommendations.length = 10
            }
          }

        }

        if (bundles.CategoryRecommendations && type === 'pdp') {
          set({
            recommendation: bundles,
            recsExist: true,
            isProduction: true,
          });
        } else if (bundles.CategoryRecommendations && type === 'plp') {
          set({
            productListBundles: bundles,
            productListExist: true,
            isProduction: true,
          });
        } else if (bundles.CategoryRecommendations && type === 'Home') {
          set({
            homePageBundles: bundles,
            homePageExist: true,
            isProduction: true,
          });
        } else if (bundles.CategoryRecommendations && type === 'New Arrivals') {
          set({
            newArrivalsBundles: bundles,
            newArrivalsExist: true,
            isProduction: true,
          });
        } else if (bundles.CategoryRecommendations && type === 'Search') {
          set({
            searchBundles: bundles,
            searchExist: true,
            isProduction: true,
          });
        } else if (bundles.CategoryRecommendations && type === 'Search BestSeller') {
          set({
            searchBestSellerBundles: bundles,
            searchBestSellerExist: true,
            isProduction: true,
          });
        } else if (bundles.CategoryRecommendations && type === 'Most Popular') {
          set({
            MostPopularBundles: bundles,
            MostPopularExist: true,
            isProduction: true,
          });
        } else if (bundles.CategoryRecommendations && type === 'Best Sellers') {
          set({
            bestSellersBundles: bundles,
            bestSellersExist: true,
            isProduction: true,
          });
        } else if (bundles.CategoryRecommendations && type === 'Best Sellers 30D') {
          set({
            bestSellers30DBundles: bundles,
            bestSellers30DExist: true,
            isProduction: true,
          });
        } else if (bundles.CategoryRecommendations && type === 'Best Sellers Low Price') {
          if (cartIds) {
            const filteredBundles = bundles.CategoryRecommendations.filter((product) => !cartIds.includes(product.ProductId));
            bundles.CategoryRecommendations = filteredBundles
          }
          set({
            bestSellerLowPriceBundles: bundles,
            bestSellerLowPriceExist: true,
            isProduction: true,
          });
        } else if (bundles.CategoryRecommendations && type === 'Cart Recommendation') {
          set({
            cartPageRecommendationBundles: bundles,
            cartPageRecommendationExist: true,
            isProduction: true,
          });
        } else if (bundles.CategoryRecommendations && type === 'Most loved products') {
          set({
            mostLovedBundles: bundles,
            mostLovedExist: true,
            isProduction: true,
          });
        } else if (bundles.CategoryRecommendations && type === 'More to discover') {
          set({
            moreToDiscoverBundles: bundles,
            moreToDiscoverExist: true,
            isProduction: true,
          });
        } else if (bundles.CategoryRecommendations && type === 'Most Popular Trees Exist') {
          set({
            MostPopularTreesBundles: bundles,
            MostPopularTreesExist: true,
            isProduction: true,
          });
        } else if (type === 'pdp') {
          get().makeCartEmpty('pdp');
          get().bundleAvalaible = [];
          get().firstThreePDP = [];
          get().cart = [];
          get().mainProduct = {};
          set({
            bundles: {},
            bundlesExist: false,
            addedProductIds: [],
            firstThreePDP: [],
            cart: [],
          });
          set({
            bundles,
            mainProduct: bundles.ProductsDetail[0],
            bundlesExist: true,
            isProduction: true,
            
          });
          const preAddCount = 3;
          clientConfig.dbProducts = bundles.ProductsDetail.length - 1;
          const imagesDetails = [];
          for (let i = 0; i < preAddCount; i += 1) {
            if (bundles.ProductsDetail[i]) {
              // Price

              const product = bundles.ProductsDetail[i];
              if (product.Attributes) {
                product.Price = product.Attributes[0].attributeValues[0].childProductPrice;
                product.SpecialPrice = product.Attributes[0]
                  .attributeValues[0]
                  .childProductSpecialPrice;
                const { childProductId } = product.Attributes[0].attributeValues[0];
                get().addToStore(product, 1, childProductId);
                imagesDetails.push(product);
              } else {
                product.Price = product.Price;
                product.SpecialPrice = product.SpecialPrice;
                const { childProductId } = product.ProductId;
                get().addToStore(product, 1, childProductId);
                imagesDetails.push(product);
              }
            }
          }
          set({
            bundleAvalaible: [...imagesDetails],
          });
        } else if (type === 'sidebar') {

          set({
            sidebarBundles: bundles,
            mainProduct: bundles.ProductsDetail[0],
            sidebarExist: true,
            sidebarLoading: 'Success',
          });
        } else if (type === 'cart') {
          const dummyProduct = bundles.ProductsDetail.findIndex((product) => product.ProductId === 'dummy');
          if (dummyProduct > 0) {
            delete bundles.ProductsDetail[dummyProduct];
          }

          const filteredBundles = bundles.ProductsDetail.filter((product) => !cartIds.includes(product.ProductId));

          bundles.ProductsDetail = filteredBundles
          set({
            cartBundles: bundles,
            cartExist: true,
            isProduction: true,
          });
        }
      }).catch((error) => {
        if (type === 'Search') {
          set({
            searchBundles: {},
            searchExist: false,
            isProduction: true,
          });
        }
        if (type === 'sidebar') {
          set({
            sidebarLoading: 'Failed',
            sidebarExist: false,/*  */
            cart: [],
          });
          document.body.style.overflow = '';
          document.querySelector('html').style.overflow = '';
          setTimeout(() => {
            set({
              sidebarLoading: false,
              sidebarExist: false,
            });
          }, 1500);

        }
      });
  },

  addToStore: (product, qty, activeId) => {
    set((state) => {
      const isPresent = state.cart.findIndex(
        (item) => item.ProductId === product.ProductId,
      );
      const newProduct = product;

      newProduct.qtyAdded = qty;
      newProduct.activeId = activeId;
      newProduct.ImageURL = product.ImageURL;

      if (product.activeOptions !== undefined) {
        if (Object.keys(product.activeOptions).length !== 0) {
          newProduct.activeOptions = product.activeOptions;
        }
      }

      const newState = state;
      if (isPresent === -1) {
        return {
          ...state,
          cart: [...state.cart, newProduct],

        };
      }
      if (product.activeOptions !== undefined) {
        if (Object.keys(product.activeOptions).length !== 0) {
          newState.cart[isPresent] = newProduct;
        }
      }

      return {
        ...newState,
        cart: newState.cart,
      };
    });
    get().calculateTotal();
    get().addProductId(product.ProductId);
  },

  removeFromStore: (id) => {

    set((state) => ({
      cart: state.cart.filter((item) => item.ProductId !== id),
    }));
    get().calculateTotal();
    get().removeProductId(id);
  },

  calculateTotal: () => {
    set((state) => {
      let currentTotal = 0;
      let currentSaved = 0;
      let totalCartQty = 0;
      if (state.cart.length !== 0) {
        currentTotal = state.cart
          .map(
            (item) => (item.SpecialPrice == null || item.SpecialPrice == 0
              ? item.Price * item.qtyAdded
              : item.SpecialPrice * item.qtyAdded),
          )
          .reduce((prev, next) => Number(prev) + Number(next));

        currentSaved = state.cart
          .map((item) => (item.SpecialPrice == null || item.SpecialPrice == 0 ? 0 : (item.Price - item.SpecialPrice) * item.qtyAdded))
          .reduce((prev, next) => Number(prev) + Number(next));
        totalCartQty = state.cart
          .map((item) => (item.qtyAdded == null ? 1 : item.qtyAdded))
          .reduce((prev, next) => Number(prev) + Number(next));
      }

      return {
        total: currentTotal,
        saved: currentSaved,
        totalCartQuantity: totalCartQty,
      };
    });
  },

  addProductId: (id) => {
    set((state) => {
      const isPresent = state.addedProductIds.find((item) => item === id);

      if (!isPresent) {
        return {
          ...state,
          addedProductIds: [...state.addedProductIds, id],

        };
      }

      return {
        ...state,
        addedProductIds: state.addedProductIds,
      };
    });
  },

  removeProductId: (id) => {
    set((state) => {
      const updatedIds = state.addedProductIds.filter((item) => item !== id);
      return {
        ...state,
        addedProductIds: updatedIds,
      };
    });
  },
  addToClient: (products) => {
    set({ addToCartLoader: true, addedFrom: 'PDP', sidebarAddedProducts: [] });

    async function fetchUrlsSequentially(products) {
      const responses = [];
      function getCartId() {
        let cartId = localStorage.getItem('cartId');
        if (cartId !== null) {
          cartId = cartId.replaceAll('"', '');
        } else {
          cartId = 'none';
        }
        if (cartId == ''){
          cartId = 'none';
        }
        return cartId;
      }

      let loggedIn = false
      if (localStorage.getItem('inc_isln') == "true") {
        loggedIn = true
      }
      fetch('/api/auth/session')
        .then((response) => response.json())
        .then((data) => {
          if (Object.keys(data).length !== 0) {
            if (data.isUserLoggedIn) {
              loggedIn = true
              localStorage.setItem('inc_isln', true)
            } else {
              localStorage.setItem('inc_isln', false)
            }
          } else {
            localStorage.setItem('inc_isln', false)
          }
        })
        .catch(function () {
          localStorage.setItem('inc_isln', false)
        });

      let loggParam = 'anonymous'
      if (loggedIn) {
        loggParam = 'current'
      }

      // CHECK ASM

      let isASMSession = checkForAsmUrlEnable()

      if (isASMSession) {
        let asmUserType = getUserType()
        if (asmUserType !== null) {
          loggParam = asmUserType
        }
      }

      console.log(loggParam)

      const getURL = () => {
        if (window.location.origin === 'https://uat-ui.i.balsamhill.com.au') {
          return `/api/addProductToCart/bh-au/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=AUD`;
        } if (window.location.origin === 'https://uat-ui.i.balsamhill.co.uk') {
          return `/pi/addProductToCart/bh-uk/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=GBP`;
        } if (window.location.origin === 'https://uat-ui.i.balsamhill.com') {
          return `/api/addProductToCart/bh-us/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=USD`;
        }
        if (window.location.origin === 'https://uat-ui.i.balsamhill.ca') {
          return `/api/addProductToCart/bh-ca/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=CAD`;
        }
        if (window.location.origin === 'https://www.balsamhill.ca') {
          return `/api/addProductToCart/bh-ca/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=CAD`;
        }
        if (window.location.origin === 'https://www.balsamhill.com.au') {
          return `/api/addProductToCart/bh-au/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=AUD`;
        } if (window.location.origin === 'https://www.balsamhill.co.uk') {
          if (currencyCheck() === "EUR") {
            return `/api/addProductToCart/bh-uk/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=EUR`;
          }
          return `/api/addProductToCart/bh-uk/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=GBP`;
        } if (window.location.origin === 'https://www.balsamhill.com') {
          return `/api/addProductToCart/bh-us/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=USD`;
        }
      };
      const addedProductFromIRB = [];
      for (const product of products) {
        const bodyParams = {
          product: {
            code: product.activeId || product.ProductId,
            multidimensional: true,
            purchasable: false,
          },
          quantity: product.qtyAdded,
          variantProperties: [],
        };
        const response = await fetch(getURL(), {
          headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'content-type': 'application/json',
          },
          body: JSON.stringify(bodyParams),
          method: 'POST',
        });
        const { headers } = response;

        // Log all the header keys and their values
        for (const key of headers.keys()) {
          if (key === 'cart-id' && getCartId() == 'none') {
            localStorage.setItem('cartId', `"${headers.get(key)}"`);
          }
        }

        const data = await response.json();
        responses.push(data);
        // console.log(product);
        // console.log(data);

        if (data.errors) {
          // console.log('removed', product.ProductId);
          get().removeFromStore(product.ProductId);
          const errorMessage = `${product.ProductName} ${data.errors[0].message}`;
          get().setSidebarErrors(errorMessage);

          addedProductFromIRB.push(product.ProductId);
        } else {
          try {

            let productIDFromBundle = document.querySelector('div[data-activeid="' + product.code + '"]')
            let productIDFromBundleID = null
            if (productIDFromBundle) {
              productIDFromBundleID = productIDFromBundle.getAttribute('data-productid')
            }
            if (!productIDFromBundleID) {
              if (data.entry.product.baseProduct) {
                productIDFromBundleID = data.entry.product.baseProduct
              } else {
                productIDFromBundleID = Product.ProductId
              }

            }
            if (!productIDFromBundle) {
              productIDFromBundleID = product.ProductId
            }
            // console.log(addedProductFromIRB)
            addedProductFromIRB.push(productIDFromBundleID);
          } catch (error) {
            // console.log(error)
          }

        }
      }
      set((state) => ({
        sidebarAddedProducts: [...addedProductFromIRB],
      }));
      // Set extended Warrany
      return responses;
    }

    fetchUrlsSequentially(products)
      .then((response) => {
        const warranty = [];
        const addedProductFromIRB = [];
        response.map((data) => {
          if (data.entry.extendWarrantyPriceData) {
            const warrantyDetails = {};
            warrantyDetails.warrantyData = data.entry.extendWarrantyPriceData;
            warrantyDetails.product = data.entry.product;
            warrantyDetails.qtyAdded = data.quantityAdded
            warranty.push(warrantyDetails);
          }
          addedProductFromIRB.push(data.entry.product.baseProduct);
        });
        set({
          extendedWarrantyMultiple: [...warranty],
        });

        if (warranty.length !== 0) {
          if (window.Extend == undefined) {
            async function LoadAndSetExtend() {
              let res = await loadScript(clientConfig.extendScript)
              if (res) {
                if (Extend) {
                
                  Extend.config({ storeId: clientConfig.extendStoreId, environment: clientConfig.extendEnvironment })
                 
                }
              }
            }
            LoadAndSetExtend()
          }
        }

        get().updateClientCart();
        set({ addToCartLoader: false, addToCart: true });
      })
      .catch((error) => {
        get().updateClientCart();
        set({ addToCartLoader: false, addToCart: true });
      });
  },



  addOptionsToCart: (id, options, updatedProduct) => {
    if (options !== '') {
      set((state) => {
        const isPresent = state.cart.find(
          (item) => item.ProductId === id,
        );
        const isPresentIndex = state.cart.findIndex(
          (item) => item.ProductId === id,
        );

        if (isPresent !== undefined) {
          const newProduct = isPresent;
          if (Object.keys(options).length !== 0) {
            newProduct.activeOptions = options;
          }
          if (updatedProduct) {
            newProduct.ImageURL = updatedProduct.ImageURL;
          }

          const newState = state;
          newState.cart[isPresentIndex] = newProduct;

          return {
            ...newState,
          };
        }
        return {
          ...state,
          cart: state.cart,
        };
      });
    }
  },



  updateClientCart: async (fbt) => {
    
    if (fbt) {
      set({ addToCartLoader: true });
    }
    const fetchresponse = { status: 100 };
    function getCartId() {
      let cartId = localStorage.getItem('cartId');
      if (cartId !== null) {
        cartId = cartId.replaceAll('"', '');
      } else {
        cartId = 'none';
      }
      if (cartId == ''){
        cartId = 'none';
      }
      return cartId;
    }


    let authType = 'hybrisToken'

    let loggedIn = false
    if (localStorage.getItem('inc_isln') == "true") {
      loggedIn = true
      authType = 'hybrisAuth'
    }

    async function getResponse() {
      const response = await fetch('');
      if (!response.ok) {

      }
      const data = await response.json();
    }

    const API_URL = '/api/auth/session';
    async function fetchUsers() {
      const response = await fetch(API_URL)
      const users = await response.json();
      return users;
    }

    await fetchUsers().then(async (data) => {
      // console.log(data)
      if (Object.keys(data).length !== 0) {
        if (data.isUserLoggedIn) {
          loggedIn = true
          localStorage.setItem('inc_isln', true)
          authType = 'hybrisAuth'
        } else {
          localStorage.setItem('inc_isln', false)
          authType = 'hybrisToken'
        }
      } else {
        localStorage.setItem('inc_isln', false)
        authType = 'hybrisToken'
      }

      let loggParam = 'anonymous'
      if (loggedIn) {
        loggParam = 'current'
      }

      let isASMSession = checkForAsmUrlEnable()

      if (isASMSession) {
        let asmUserType = getUserType()
        if (asmUserType !== null) {
          loggParam = asmUserType
        }
      }

      const getURL = () => {
        if (window.location.origin === 'https://uat-ui.i.balsamhill.com.au') {
          return `/api/${authType}/bh-au/users/${loggParam}/carts/${getCartId()}?fields=BASIC&curr=AUD`;
        } if (window.location.origin === 'https://uat-ui.i.balsamhill.co.uk') {
          return `/api/${authType}/bh-uk/users/${loggParam}/carts/${getCartId()}?fields=BASIC&curr=GBP`;
        } if (window.location.origin === 'https://uat-ui.i.balsamhill.com') {
          return `/api/${authType}/bh-us/users/${loggParam}/carts/${getCartId()}?fields=BASIC&curr=USD`;
        }
        if (window.location.origin === 'https://uat-ui.i.balsamhill.ca') {
          return `/api/${authType}/bh-ca/users/${loggParam}/carts/${getCartId()}?fields=BASIC&curr=CAD`;
        }
        if (window.location.origin === 'https://www.balsamhill.ca') {
          return `/api/${authType}/bh-ca/users/${loggParam}/carts/${getCartId()}?fields=BASIC&curr=CAD`;
        }
        if (window.location.origin === 'https://www.balsamhill.com.au') {
          return `/api/${authType}/bh-au/users/${loggParam}/carts/${getCartId()}?fields=BASIC&curr=AUD`;
        } if (window.location.origin === 'https://www.balsamhill.co.uk') {
          if (currencyCheck() === "EUR") {
            return `/api/${authType}/bh-uk/users/${loggParam}/carts/${getCartId()}?fields=BASIC&curr=EUR`;
          }
          return `/api/${authType}/bh-uk/users/${loggParam}/carts/${getCartId()}?fields=BASIC&curr=GBP`;
        } if (window.location.origin === 'https://www.balsamhill.com') {
          return `/api/${authType}/bh-us/users/${loggParam}/carts/${getCartId()}?fields=BASIC&curr=USD`;
        }
      };

      if (getCartId() == "none") return
      await fetch(getURL(), {
        body: null,
        method: 'GET',
      }).then((response) => response.json()).then((response) => {
        if (response.totalUnitCount) {
          
          const cartIcon = document.querySelector('.headerIcons_cart-icon__gn08h a');
          if (cartIcon.querySelector('.headerIcons_custom-badge__Gv9jW') == null) {

            const cartElement = document.createElement('span');
            cartElement.setAttribute('aria-hidden', true);
            cartElement.classList.add('headerIcons_custom-badge__Gv9jW');
            cartElement.innerText = response.totalUnitCount;
            
            if (cartIcon.firstChild) {
              cartIcon.insertBefore(cartElement, cartIcon.firstChild);
          } 
          } else {
            cartIcon.querySelector('.headerIcons_custom-badge__Gv9jW').innerText = response.totalUnitCount;
            cartIcon.querySelector('.headerIcons_custom-badge__Gv9jW').innerText = `${response.totalUnitCount}`;
          }
          fetchresponse.status = 200
          return fetchresponse;
        }
        if (response.errors) {
          if (response.errors[0].reason === 'notFound') {
            localStorage.removeItem('cartId');
            // window.location.reload()
            fetchresponse.status = 400
            // console.log('asd')
            return fetchresponse;
          }
        }
      });
      return fetchresponse
    });

    return fetchresponse

  },

  addSingleToClient: async (activeId, qtyAdded, type) => {
    set({ addToCartSingleLoader: true, addToCart: false, addedFrom: type });
    await get().updateClientCart();

    const fetchresponse = { status: 500 };
    function getCartId() {
      let cartId = localStorage.getItem('cartId');
      if (cartId !== null) {
        cartId = cartId.replaceAll('"', '');
      } else {
        cartId = 'none';
      }
      if (localStorage.getItem('cartId') == '""') {
        cartId = 'none';
      }
      if (cartId == ''){
        cartId = 'none';
      }
      return cartId;
    }
    let loggedIn = false
    if (localStorage.getItem('inc_isln') == "true") {
      loggedIn = true
    }
    fetch('/api/auth/session')
      .then((response) => response.json())
      .then((data) => {
        if (Object.keys(data).length !== 0) {
          if (data.isUserLoggedIn) {
            loggedIn = true
            localStorage.setItem('inc_isln', true)
          } else {
            localStorage.setItem('inc_isln', false)
          }
        } else {
          localStorage.setItem('inc_isln', false)
        }
      })
      .catch(function () {
        localStorage.setItem('inc_isln', false)
      });
    let loggParam = 'anonymous'
    if (loggedIn) {
      loggParam = 'current'
    }

    let isASMSession = checkForAsmUrlEnable()

    if (isASMSession) {
      let asmUserType = getUserType()
      if (asmUserType !== null) {
        loggParam = asmUserType
      }
    }
    const getURL = () => {
      if (window.location.origin === 'https://uat-ui.i.balsamhill.com.au') {
        return `/api/addProductToCart/bh-au/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=AUD`;
      } if (window.location.origin === 'https://uat-ui.i.balsamhill.co.uk') {
        return `/api/addProductToCart/bh-uk/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=GBP`;
      } if (window.location.origin === 'https://uat-ui.i.balsamhill.com') {
        return `/api/addProductToCart/bh-us/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=USD`;
      }
      if (window.location.origin === 'https://uat-ui.i.balsamhill.ca') {
        return `/api/addProductToCart/bh-ca/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=CAD`;
      }
      if (window.location.origin === 'https://www.balsamhill.ca') {
        return `/api/addProductToCart/bh-ca/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=CAD`;
      }
      if (window.location.origin === 'https://www.balsamhill.com.au') {
        return `/api/addProductToCart/bh-au/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=AUD`;
      } if (window.location.origin === 'https://www.balsamhill.co.uk') {
        if (currencyCheck() === "EUR") {
          return `/api/addProductToCart/bh-uk/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=EUR`;
        }
        return `/api/addProductToCart/bh-uk/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=GBP`;
      } if (window.location.origin === 'https://www.balsamhill.com') {
        return `/api/addProductToCart/bh-us/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=USD`;
      }
    };

    if (type === 'recs_fbt') {
      set({
        cart: [],
        addedProductIds: [],
        total: {},
        totalCartQty: 0,
      });
    }
    const bodyParams = {
      product: {
        code: activeId,
        multidimensional: true,
        purchasable: false,
      },
      variantProperties: [],
      quantity: qtyAdded,
    };
    await fetch(getURL(), {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
      method: 'POST',
    }).then((response) => {
      if (getCartId() === 'none') {
        const cartId = response.headers.get('cart-id');
        if (cartId !== null) {
          localStorage.setItem('cartId', `"${cartId}"`);
        }
      }
      return response.json();
    }).then((response) => {
      if (response.entry) {
        if (response.entry.extendWarrantyPriceData) {
          const warrantyDetails = {};
          warrantyDetails.warrantyData = response.entry.extendWarrantyPriceData;
          warrantyDetails.product = response.entry.product;
          warrantyDetails.qtyAdded = response.quantityAdded;
          const warrantyArray = [warrantyDetails];
          set((state) => ({
            ...state,
            extendedWarranty: [response.entry.extendWarrantyPriceData],
            extendedWarrantyMultiple: [...state.extendedWarrantyMultiple, ...warrantyArray],
          }));

          if (window.Extend == undefined) {
            async function LoadAndSetExtend() {
              let res = await loadScript(clientConfig.extendScript)
              if (res) {
                if (Extend) {
                
                  Extend.config({ storeId: clientConfig.extendStoreId, environment: clientConfig.extendEnvironment })
                 
                }
              }
            }
            LoadAndSetExtend()
          }

        } else {
          set({
            extendedWarranty: [],
          });
        }
      }

      // console.log(response);
      set({
        clientAddToCartResponse: response,
      });
      set({ addToCartSingleLoader: false, addToCart: true });
      get().updateClientCart();
      setTimeout(() => {
        set({ addToCart: false });
      }, 2500);

      set((state) => {
        let productIDFromBundle = document.querySelector('div[data-activeid="' + activeId + '"]')
        let productIDFromBundleID = null
        if (productIDFromBundle) {
          productIDFromBundleID = productIDFromBundle.getAttribute('data-productid')
        }
        if (!productIDFromBundleID) {
          productIDFromBundleID = response.entry.product.code
        }
        if (document.querySelector('.EZDrawer')) {

          return {
            sidebarAddedProducts: [...state.sidebarAddedProducts, productIDFromBundleID],
          };
        }

        return {

          sidebarAddedProducts: [productIDFromBundleID],
        };
      });
      // set({
      //   sidebarAddedProducts:[entry.product.baseProduct]
      // })

      fetchresponse.status = 200;
      fetchresponse.data = response;
      return fetchresponse;
    }).catch((error) => {
      setTimeout(() => {
        set({ addToCartSingleLoader: false, addToCart: false });
      }, 2000);
      fetchresponse.status = 401;
      fetchresponse.data = error;
      return fetchresponse;
    });

    return fetchresponse;
  },
  addWarrantyToClient: async (activeId, qtyAdded, type, warrantySkuId) => {
    get().handleCurrentAddToCartId('000', '000');
    const fetchresponse = { status: 500 };
    function getCartId() {
      let cartId = localStorage.getItem('cartId');
      if (cartId !== null) {
        cartId = cartId.replaceAll('"', '');
      } else {
        cartId = 'none';
      }
      if (cartId == ''){
        cartId = 'none';
      }
      return cartId;
    }
    let loggedIn = false
    if (localStorage.getItem('inc_isln') == 'true') {
      loggedIn = true
    }
    fetch('/api/auth/session')
      .then((response) => response.json())
      .then((data) => {
        if (Object.keys(data).length !== 0) {
          if (data.isUserLoggedIn) {
            loggedIn = true
            localStorage.setItem('inc_isln', true)
          } else {
            localStorage.setItem('inc_isln', false)
          }
        } else {
          localStorage.setItem('inc_isln', false)
        }
      })
      .catch(function () {
        localStorage.setItem('inc_isln', false)
      });
    let loggParam = 'anonymous'
    if (loggedIn) {
      loggParam = 'current'
    }

    let isASMSession = checkForAsmUrlEnable()

    if (isASMSession) {
      let asmUserType = getUserType()
      if (asmUserType !== null) {
        loggParam = asmUserType
      }
    }

    const getURL = () => {
      if (window.location.origin === 'https://uat-ui.i.balsamhill.com.au') {
        return `/api/addProductToCart/bh-au/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=AUD`;
      } if (window.location.origin === 'https://uat-ui.i.balsamhill.co.uk') {
        return `/api/addProductToCart/bh-uk/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=GBP`;
      } if (window.location.origin === 'https://uat-ui.i.balsamhill.com') {
        return `/api/addProductToCart/bh-us/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=USD`;
      }
      if (window.location.origin === 'https://uat-ui.i.balsamhill.ca') {
        return `/api/addProductToCart/bh-ca/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=CAD`;
      }
      if (window.location.origin === 'https://www.balsamhill.ca') {
        return `/api/addProductToCart/bh-ca/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=CAD`;
      }
      if (window.location.origin === 'https://www.balsamhill.com.au') {
        return `/api/addProductToCart/bh-au/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=AUD`;
      } if (window.location.origin === 'https://www.balsamhill.co.uk') {
        return `/api/addProductToCart/bh-uk/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=GBP`;
      } if (window.location.origin === 'https://www.balsamhill.com') {
        return `/api/addProductToCart/bh-us/users/${loggParam}/carts/${getCartId()}/entries?fields=FULL&curr=USD`;
      }
    };
    set({ addToCartSingleLoader: true, addToCart: false, addedFrom: type });
    const bodyParams = {
      product: {
        code: activeId,
        purchasable: false,
      },
      warrantySkuId,
      quantity: qtyAdded,
    };
    await fetch(getURL(), {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
      method: 'POST',
    }).then((response) => {
      if (getCartId() === 'none') {
        const cartId = response.headers.get('cart-id');
        if (cartId !== null) {
          localStorage.setItem('cartId', `"${cartId}"`);
        }
      }
      return response.json();
    }).then((response) => {
      set({ addToCartSingleLoader: false, extendedWarrantyAdded: true });
      setTimeout(() => {
        set({ extendedWarrantyAdded: false });
      }, 2000);
      if (response.errors) {
        fetchresponse.status = 401;
        fetchresponse.data = response;
        return fetchresponse;
      }
      fetchresponse.status = 200;
      fetchresponse.data = response;
      get().updateClientCart();
      return fetchresponse;
    }).catch(() => {
      setTimeout(() => {
        set({ addToCartSingleLoader: false, extendedWarrantyAdded: true });
      }, 2000);
    });
    return fetchresponse;
  },
  handleOutOfStock: (value) => {
    set({ outOfStock: value });
  },

  handlePageType: (value) => {
    set({ pageType: value });
  },

  handleIsMobileOpen: () => {
    set((state) => ({
      isMobileOpen: true,
    }));
  },

  handleSidebar: (value) => {
    set((state) => ({
      sidebarOpen: value,
    }));
  },

  addToSidebarCart: (value) => {
    set((state) => ({
      sidebarCart: value,
    }));
  },

  setSidebarErrors: (value) => {
    set((state) => ({
      sidebarErrors: [...state.sidebarErrors, value],
    }));
    setTimeout(() => {
      set((state) => ({
        sidebarErrors: [...state.sidebarErrors.filter((value) => value !== value)],
      }));
    }, 5000);
  },

  handleCartLoaderState: () => {
    set({
      addToCart: false,
      addToCartLoader: false,
    });
  },
  handleCurrentAddToCartId: (value, uniqueType) => {
    set({
      currentAddToCartId: value + uniqueType,
    });
  },

  removeWarranty: (product) => {
    set((state) => {
      const updatedWarranty = state.extendedWarrantyMultiple.filter((item) => item.product.code !== product.product.code);
      return {
        ...state,
        extendedWarrantyMultiple: updatedWarranty,
      };
    });
  },
  clearWarranty: () => {
    set({
      extendedWarrantyMultiple: [],
      warrantyData: [],
    });
  },
  makeCartEmpty: (value, bundlesExist) => {
    set({
      cart: [],
      addedProductIds: [],
      total: {},
      totalCartQty: 0,
    });

    if (value === 'pdp' && bundlesExist === false) {
      set({
        sidebarExist: false,
        sidebarBundles: [],

      });
    }
    if (value !== 'pdp') {
      set({
        sidebarExist: false,
        sidebarBundles: [],

      });
    }
  },

  handleFailedProductIDS: (value) => {
    set((state) => ({
      failedProductIDS: [...state.failedProductIDS, value],
    }));
  },
  clearSidebarAddedIDS: () => {
    // console.log("Sidebar IDS Cleared")
    set({
      sidebarAddedProducts: [],
    });
  },

  setClientModal: (value) => {
    set({
      clientModalOpen: value,
    });
  },

}));

export default useStore;
