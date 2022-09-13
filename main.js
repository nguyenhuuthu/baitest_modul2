let arrObj = [];
let objects = {
  id: null,
  title: "",
  description: "",
  image: "",
  pageId: null,
};
function fn(exception, jsonData) {
  arrObj = [];
  const arrTitleResponse = jsonData[1];
  if (Array.isArray(jsonData)) {
    let arrTitle = [];
    for (let index = 0; index < arrTitleResponse.length; index++) {
      arrTitle.push(arrTitleResponse[index]);
    }
    for (let index = 0; index < arrTitle.length; index++) {
      objects = {
        id: index,
        title: arrTitle[index],
        description: "",
        image: "",
      };
      arrObj.push(objects);
    }
    arrObj.forEach((element) => {
      url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageprops|pageimages&format=json&titles=${element.title}`;
      getData(url, getThumbnail);
    });
    addElement();
  }
}
let keyword = "";
var url = ``;

function getThumbnail(exception, jsonData) {
  let pageThumbnail = jsonData.query.pages;
  const mapped = Object.entries(pageThumbnail).map(([key, value]) => value);
  for (let i = 0; i < arrObj.length; i++) {
    if (arrObj[i].title == mapped[0].title) {
      arrObj[i].description = mapped[0].pageprops["wikibase-shortdesc"];
      if (mapped[0].thumbnail) {
        arrObj[i].image = mapped[0].thumbnail.source;
      }
    }
  }
}
function addElement() {
  arrObj.forEach((element) => {
    console.log(element);
    let createEle = document.createElement("div");
    let ele = `
      <div class="product">
        <img src="${element.image}" alt="photo">
        ${element.image}
        </img>
        <div class="product-name">
          <h2>${element.title}</h2>
          <h2>${element.image}</h2>
          <h4>${element.description}</h4>
        </div>
      </div>`;
    createEle.innerHTML = ele;
    let parent = document.getElementById("product-list");
    parent.append(createEle);
  });
}
let inputValue = document.getElementById("searchInput");

inputValue.addEventListener("input", function (evt) {
  arrObj = [];
  keyword = this.value;
  url = `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&limit=10&format=json&search=${keyword}`;
  getData(url, fn);
});
function getData(url, fn) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        fn(undefined, JSON.parse(xhr.responseText));
      } else {
        fn(new Error(xhr.statusText), undefined);
      }
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}
