let allVideos = [];
let isSorted = false;

// fetch all the categories of video
const getCategory = async () => {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/videos/categories"
  );
  const data = await response.json();
  const categories = data.data;
  displayCategories(categories);
};

// display all categories
const displayCategories = (categories) => {
  const displayCategory = document.getElementById("category");
  categories.forEach((category) => {
    const div = document.createElement("div");
    div.classList.add("basis-16");
    div.innerHTML = `
      <button data-index="${category.category_id}" onclick="videosByCategory('${
      category.category_id
    }')" class="category-btn btn btn-sm px-6 font-medium normal-case ${
      category.category === "All" && "bg-red-500 text-white"
    }">${category.category}</button>
    `;
    displayCategory.appendChild(div);
  });
};

// fetch the videos by category
const videosByCategory = async (categoryId) => {
  isSorted = false;
  const response = await fetch(
    `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
  );
  const data = await response.json();
  const videos = data.data;
  allVideos = data.data;
  const allCategoryBtn = document.querySelectorAll(".category-btn");
  for (const btn of allCategoryBtn) {
    if (btn.getAttribute("data-index") === categoryId) {
      btn.classList.add("bg-red-500", "text-white");
    } else {
      btn.classList.remove("bg-red-500", "text-white");
    }
  }

  handleVideos(videos);
};

// handle videos sorted by views
document.getElementById("sort-by-views").addEventListener("click", () => {
  isSorted = !isSorted;
  if (isSorted) {
    const copyArray = [...allVideos];
    let sortedVideos = copyArray.sort(
      (a, b) => parseInt(b.others.views) - parseInt(a.others.views)
    );
    return handleVideos(sortedVideos);
  } else {
    return handleVideos(allVideos);
  }
});

// convert seconds to hours and minutes
const secToHourMin = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const remainSeconds = seconds % 3600;
  const minutes = Math.floor(remainSeconds / 60);
  return { hours, minutes };
};

// display all videos
const handleVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");
  videoContainer.textContent = "";
  if (videos.length <= 0) {
    videoContainer.classList.remove("grid");
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="flex flex-col justify-center items-center text-center pt-10 md:pt-20">
        <img src="./assets/Icon.png" class="w-40">
        <h1 class="text-2xl font-semibold">Oops!! Sorry, There is no <br> content here</h1>
      </div>
    `;
    videoContainer.appendChild(div);
  } else {
    videoContainer.classList.add("grid");
    videos.forEach((video) => {
      const totalSeconds = parseInt(video?.others?.posted_date);
      const { hours, minutes } = secToHourMin(totalSeconds);
      const div = document.createElement("div");
      div.className =
        "card bg-base-100 hover:shadow-lg duration-200 cursor-pointer rounded-lg p-3";
      div.innerHTML = `
          <div class="h-[12rem] rounded-md bg-cover bg-[url('${
            video?.thumbnail
          }')] relative">
              <div class="bg-[rgba(0,0,0,0.5)] text-gray-300 text-sm px-3 absolute bottom-3 right-2 rounded-md ${
                !video.others?.posted_date && "hidden"
              }">${hours}hrs ${minutes} min ago</div>
          </div>
            <div class="card-body p-0 pt-5">
              <div class="flex gap-4">
                  <div class="h-12 w-12 rounded-full bg-cover bg-[url('${
                    video?.authors[0]?.profile_picture
                  }')]">
                  </div>
                  <div class="space-y-1">
                    <h2 class="card-title text-lg hover:underline">${
                      video?.title
                    }</h2>
                    <div class="flex gap-1 items-center">
                      <h2 class="hover:underline">${
                        video?.authors[0]?.profile_name
                      }</h2>
                      <div class="${!video?.authors[0]?.verified && "hidden"}">
                        <img src="./assets/checklist.png" class="w-4">
                      </div>
                    </div>
                    <p>${video.others?.views} views</p>
                  </div>
                  </div>
              </div>
        `;
      videoContainer.appendChild(div);
    });
  }
};

// blog page assign
const handleBlog = () => {
  location.assign("./blog.html");
};

// initial call
videosByCategory("1000");
getCategory();
