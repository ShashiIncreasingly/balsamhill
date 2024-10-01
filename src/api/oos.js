import { Base64 } from '../lib/helpers';
import { clientConfig } from '../zustand/store';

function oosproduct(prdid) {
  const productId = prdid;
  const qty = 0;
  const formatJsonData = JSON.stringify({
    token: clientConfig.client_id,
    product_id: productId,
    quantity: qty,
  });

  if (productId != null) {
    const data = {
      eventData: Base64.encode(formatJsonData),
    };
    const URL = 'https://gather.increasingly.com/ProductInventoryUpdate';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', URL, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) { // console.log(xhr.responseText)
        }
      }
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  }
}

export default oosproduct;
