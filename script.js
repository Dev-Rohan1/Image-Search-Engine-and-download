let imageGallery = document.querySelector(".images");
let loadMoreBtn = document.querySelector(".load-more button");
let searchInput = document.querySelector(".search-box input");
let searchTerm = null;

let apiKey = "SQycs9DHCCDThQ98UoivYMqdglCWjLV9ZYA4ORQ75FxKyiCg8a3cSomj";
let currentPage = 1;
const perPage = 20;

const dowloadImage = (imageUrl) => {
  fetch(imageUrl)
    .then((res) => res.blob())
    .then((file) => {
      let a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => {
      alert("failed image download !");
    });
};

const genrateHtml = (images) => {
  imageGallery.innerHTML += images
    .map((img) => {
      return `<li class="card">
        <img src="${img.src.large2x}" alt="Image" />
        <div class="image-detials">
          <div class="wrapper">
            <div class="photographer">
              <span class="material-symbols-outlined"> photo_camera </span>
              <p>${img.photographer}</p>
            </div>
            <div class="download-btn" onclick="dowloadImage('${img.src.large2x}')">
              <span class="material-symbols-outlined"> download </span>
            </div>
          </div>
        </div>
      </li>`;
    })
    .join("");
};

const getImages = (apiUrl) => {
  loadMoreBtn.innerText = "loading...";
  loadMoreBtn.classList.add("disabled");

  fetch(apiUrl, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      genrateHtml(data.photos);

      loadMoreBtn.innerText = "load more";
      loadMoreBtn.classList.remove("disabled");
    });
};

const loadMoreImages = () => {
  let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  currentPage++;

  apiUrl = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    : apiUrl;

  getImages(apiUrl);
};

const searchImages = (e) => {
  if (e.target.value === "") return (searchTerm = null);

  if (e.key === "Enter") {
    searchTerm = e.target.value;
    currentPage = 1;
    imageGallery.innerHTML = "";

    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    );
  }
};

loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", searchImages);

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);
