import {
  countryByName, getCurrentFormattedTime, readCookieValue, Base64, getURLBasedCountryCode,
} from '@/lib/helpers';

let final_category; let
  final_product_ids;

function categoryCrawl() {
  const productLayerprod = [];

  var catergory_id; var
    product_ids;
  var empty_obj = {};
  if (document.querySelector('#productschema') != null) {
    let prdcategory = '';
    let catcount = 0;
    if (document.querySelectorAll('.breadcrumb .breadcrumb-item') != null) {
      const catlist = document.querySelectorAll('.breadcrumb .breadcrumb-item');
      for (let c = 0; c < catlist.length; c++) {
        if (catlist[c].innerText != 'Home') {
          if (catcount == 0) {
            prdcategory = catlist[c].innerText;
          } else {
            prdcategory = `${prdcategory}|${catlist[c].innerText}`;
          }
          catcount++;
        }
      }
    }
    const dataList = JSON.parse(document.querySelector('#productschema').innerHTML);
    for (l = 0; l < dataList.length; l++) {
      productLayerprod.push({
        category: prdcategory,
        productList: dataList[l].sku,
      });
    }

    productLayerprod.forEach((ele) => {
      if (empty_obj[ele.category]) {
        empty_obj[ele.category] += `,${ele.productList}`;
      } else {
        empty_obj[ele.category] = ele.productList;
      }
    });

    var product_arr = [];
    for (const property in empty_obj) {
      catergory_id = property;
      product_arr.push(empty_obj[property]);
    }

    if (product_arr.length > 1) {
      let pids = '';
      product_arr.forEach((ele) => {
        pids += `,${ele}`;
      });
      product_ids = pids.replace(',', '');
    } else {
      product_ids = product_arr[0];
    }

    final_category = catergory_id;
    final_product_ids = product_ids;

    if (productLayerprod.length == 0 || productLayerprod == undefined) {
      const plpproductlist = [];
      const productidscategory = [];
      const productselm = document.querySelectorAll('.layout-product-tile-holder .product-tile .product-tile-basket__btn');
      var empty_obj = {};
      var catergory_id; var
        product_ids;
      for (p = 0; p < productselm.length; p++) {
        const id = productselm[p].id.replace('pListBtn', '');
        plpproductlist.push(id);
      }
      const product_category = [];
      const pr_cat = document.querySelectorAll('.breadcrumb__item.breadcrumb__item--show');
      for (let j = 0; j < pr_cat.length; j++) {
        if (j != 0) {
          const category_data = pr_cat[j].innerText.trim();
          product_category.push(category_data);
        }
      }
      productidscategory.push({
        category: product_category[product_category.length - 1],
        productList: plpproductlist,
      });

      productidscategory.forEach((ele) => {
        if (empty_obj[ele.category]) {
          empty_obj[ele.category] += `,${ele.productList}`;
        } else {
          empty_obj[ele.category] = ele.productList;
        }
      });

      var product_arr = [];

      for (const property in empty_obj) {
        catergory_id = property;
        product_ids = empty_obj[property];
      }

      product_ids = product_ids.filter((ele) => {
        if (ele == '') {

        } else {
          return ele;
        }
      }).join();

      final_category = catergory_id;
      final_product_ids = product_ids;

      // console.log("Second_Method---->", catergory_id,product_ids)
    }
    setTimeout(() => {
      console.log('Category--->', final_category, 'Products--->', final_product_ids);
      let tricrawl = false;
      if (document.querySelector('.produt-listing-content') != null || document.querySelector('.produt-listing-container') != null) {
        tricrawl = true;
      } else if (typeof (br_data) !== 'undefined') {
        if (br_data != undefined) {
          if (br_data.ptype == 'category') {
            tricrawl = true;
          }
        }
      }

      if (tricrawl == true && (final_category != undefined && final_product_ids != undefined)) {
        let format_json_data;
        const product_id = final_product_ids.split(',')[0];

        format_json_data = JSON.stringify({
          event_data: {
            product_id,
            field1: final_category,
            description: final_product_ids,
          },
          event_type: 'product_page_visit',
          method: 'track',
          token: getURLBasedCountryCode(),
        });

        const data = {
          eventData: Base64.encode(format_json_data),
          vid: readCookieValue('ivid'),
          time: getCurrentFormattedTime(),
          uri: document.location.href,
        };
        let p_url = 'https://gather.increasingly.com/ImportCrawledData';
        if (countryByName() === 'United States') {
          p_url = 'https://usagather.increasingly.com/ImportCrawledData';
        }
        if (countryByName() === 'Australia') {
          p_url = 'https://jpgather.increasingly.com/ImportCrawledData';
        }
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
              if (xhr.responseText != '' && xhr.responseText != null) { } else { }
            }
          }
        };
        xhr.open('POST', p_url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      }
    }, 200);
  }
}
export default categoryCrawl;
