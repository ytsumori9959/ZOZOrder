let retrieveInfo = document.getElementById("retrieveInfo");
let applyInfo = document.getElementById("applyInfo");

const getPageContents = `(function getPageContents() {
let productName = document.getElementById("item-intro").getElementsByTagName("h1")[0].textContent;
let detailInfo = document.getElementById("itemDetailInfo").getElementsByTagName("dd");
let productId = detailInfo[detailInfo.length-2].textContent;
return {productName, productId};
})()`;

retrieveInfo.onclick = function (element) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, { code: getPageContents }, function (
      result
    ) {
      let { productName, productId } = result[0];
      let lastIndex = productId.indexOf("（");
      let formattedProductId = productId.slice(0, lastIndex);
      storeInfoToStorage(productName, formattedProductId);
    });
  });
};

function storeInfoToStorage(productName, productId) {
  chrome.storage.sync.set({ productName: productName, productId: productId });
}

applyInfo.onclick = function (element) {
  chrome.storage.sync.get(["productName", "productId"], function (data) {
    console.log("商品名：" + data.productName + "、品番：" + data.productId);
  });
};
