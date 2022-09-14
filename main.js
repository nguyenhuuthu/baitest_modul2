// let arrObj = [];
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
    console.log(jsonData);
    let arrTitle = [];
    for (let index = 0; index < arrTitleResponse.length; index++) {
      arrTitle.push(arrTitleResponse[index]);
      console.log(arrTitle);
    }
    for (let index = 0; index < arrTitle.length; index++) {
      objects = {
        id: index,
        title: arrTitle[index],
        description: "",
      };
      arrObj.push(objects);
    }
    arrObj.forEach((element) => {
      url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageprops|pageimages&format=json&titles=${element}`;
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

// bai 2
let input = document.querySelector("#user-input");
let suggestions;

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

input.addEventListener("keyup", () => {
  let userValue = input.value;

  let div1 = document.getElementById("suggestion");
  div1.innerHTML = "";

  getData(
    `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&limit=10&format=json&search=${userValue}`,
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);

        suggestions = res[1].filter((sug) =>
          sug.toLowerCase().startsWith(userValue)
        );
        console.log(res[1]);
        console.log(suggestions);

        suggestions.forEach((e) => {
          getData(
            `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageprops|pageimages&format=json&titles=${e}`,
            function (err1, res1) {
              if (err1) {
                console.log(err1);
              } else {
                console.log(res1);
              }

              let id = Object.keys(res1.query.pages);

              console.log(res1.query.pages[id].thumbnail.source);
              console.log(Object.keys(res1.query.pages[id].pageprops));
              let des = "wikibase-shortdesc";

              let div = document.createElement("div");
              div.classList.add("suggestion-items");

              div.innerHTML = `
              <img src="${res1.query.pages[id].thumbnail.source}"
                alt="">
            <div style="padding-left:10px">
                <h4>${e}</h4>
                <div class="suggestion-description">${res1.query.pages[id].pageprops[des]}</div>
    
            </div>
            `;

              div1.appendChild(div);

              if (userValue === "") {
                div1.innerHTML = "";
              }

              div.onclick = () => {
                window.location.href = `https://en.wikipedia.org/wiki/${e}`;
              };
            }
          );
        });
      }
    }
  );

  console.log(suggestions);
});
