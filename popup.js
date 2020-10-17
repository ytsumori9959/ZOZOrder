let retrieveInfo = document.getElementById("retrieveInfo");
let applyInfo = document.getElementById("applyInfo");

const getPageContents = `(function getPageContents() {
  let itemIntro = document.getElementById("item-intro");
  let textMutedContents = itemIntro.getElementsByClassName("textMuted");
  let productPrice;
  if (textMutedContents[0]) {
    productPrice = textMutedContents[0].textContent;
  } else {
    productPrice = itemIntro.getElementsByClassName("goods-price")[0].textContent;
  }
  let productName = itemIntro.getElementsByTagName("h1")[0].textContent;
  let detailInfos = document.getElementById("itemDetailInfo").getElementsByTagName("dd");
  let productId;
  for (var i = 0; i < detailInfos.length; i++) {
    if (detailInfos[i].textContent.includes("（ZOZO）")) {
      productId = detailInfos[i].textContent;
    }
  }
  return {productName, productId, productPrice};
})()`;

retrieveInfo.onclick = function (element) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, { code: getPageContents }, function (
      result
    ) {
      if (result) {
        let { productName, productId, productPrice } = result[0];
        if (productName && productId && productPrice) {
          let lastIndex = productId.indexOf("（");
          let formattedProductId = productId.slice(0, lastIndex);

          let firstIndex = productPrice.indexOf("¥");
          lastIndex = productPrice.indexOf("税");
          let priceStrings;
          if (lastIndex > 0) {
            priceStrings = productPrice
              .slice(firstIndex + 1, lastIndex)
              .split(",");
          } else {
            priceStrings = productPrice
              .slice(firstIndex + 1, productPrice.length)
              .split(",");
          }

          let formattedProductPrice = "";
          priceStrings.forEach(function (priceString, index) {
            formattedProductPrice += priceString;
          });
          storeInfoToStorage(
            productName,
            formattedProductId,
            formattedProductPrice
          );
        }
      }
    });
  });
};

function storeInfoToStorage(productName, productId, productPrice) {
  chrome.storage.sync.set({
    productName: productName,
    productId: productId,
    productPrice: productPrice,
  });
}

function applyPageInfo(productName, productId, productPrice) {
  return `(function applyPageInfo() {
    // TODO Implement Method
  })()`
}

applyInfo.onclick = function (element) {
  chrome.storage.sync.get(
    ["productName", "productId", "productPrice"],
    function (data) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id, { code: applyPageInfo(data.productName, data.productId, data.productPrice) });
      });
    }
  );
};
