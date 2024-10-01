import { Base64, getCurrentFormattedTime, readCookieValue } from '@/lib/helpers';

const crawlscript = (priceMismatchObj) => {

  const formatJSONData = JSON.stringify(
    {
      event_data: {
        product_id: priceMismatchObj.product_id,
        product_price: priceMismatchObj.product_price,
        special_price: priceMismatchObj.special_price,
      },
      event_type: 'product_page_visit',
      method: 'track',
      token: 'b58leuro',
    },
  );
  const data = {
    eventData: Base64.encode(formatJSONData),
    vid: readCookieValue('ivid'),
    time: getCurrentFormattedTime(),
    uri: document.location.href,
  };

  const pURL = 'https://gather.increasingly.com/ImportCrawledData';
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (xhr.responseText !== '' && xhr.responseText != null) {
          // console.log('product crawled');
        } else {
          // console.log('something happend!');
        }
      }
    }
  };
  xhr.open('POST', pURL, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
};

export default crawlscript;
