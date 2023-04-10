// ---------Responsive-navbar-active-animation-----------
function test() {
  var tabsNewAnim = $("#navbarSupportedContent");
  var selectorNewAnim = $("#navbarSupportedContent").find("li").length;
  var activeItemNewAnim = tabsNewAnim.find(".active");
  var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
  var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
  var itemPosNewAnimTop = activeItemNewAnim.position();
  var itemPosNewAnimLeft = activeItemNewAnim.position();
  $(".hori-selector").css({
    top: itemPosNewAnimTop.top + "px",
    left: itemPosNewAnimLeft.left + "px",
    height: activeWidthNewAnimHeight + "px",
    width: activeWidthNewAnimWidth + "px",
  });
  $("#navbarSupportedContent").on("click", "li", function (e) {
    $("#navbarSupportedContent ul li").removeClass("active");
    $(this).addClass("active");
    var activeWidthNewAnimHeight = $(this).innerHeight();
    var activeWidthNewAnimWidth = $(this).innerWidth();
    var itemPosNewAnimTop = $(this).position();
    var itemPosNewAnimLeft = $(this).position();
    $(".hori-selector").css({
      top: itemPosNewAnimTop.top + "px",
      left: itemPosNewAnimLeft.left + "px",
      height: activeWidthNewAnimHeight + "px",
      width: activeWidthNewAnimWidth + "px",
    });
  });
}

$(document).ready(function () {
  setTimeout(function () {
    test();
  });
});
$(window).on("resize", function () {
  setTimeout(function () {
    test();
  }, 500);
});
$(".navbar-toggler").click(function () {
  $(".navbar-collapse").slideToggle(300);
  setTimeout(function () {
    test();
  });
});

// --------------add active class-on another-page move----------
jQuery(document).ready(function ($) {
  var path = window.location.pathname.split("/").pop();
  if (path == "") {
    var element = document.getElementById("homePage");
    element.classList.add("active");
  } else if (path == "upload_page") {
    var element = document.getElementById("uploadPage");
    element.classList.add("active");
  } else if (path == "webcam_page") {
    var element = document.getElementById("webcamPage");
    element.classList.add("active");
  }
});

// Upload image predictions
const predictButton = document.getElementById("predictButton");
const spinner = document.getElementById("spinner");
const imageInput = document.getElementById("selectedImage");
const resultImage = document.getElementById("resultImage");
const clearImages = document.getElementById("clearImages");
const container = document.getElementById("display-result-wrapper");

function predictImage() {
  spinner.style.display = "block"; // Show the spinner
  // Perform the requested action here
  setResultImage();
}

function clearResults() {
  while (resultImage.firstChild) {
    // loop through all the child nodes
    resultImage.removeChild(resultImage.firstChild); // remove the child node
  }

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function setResultImage() {
  const file = imageInput.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("image", file);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/upload-image");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const imageUrl = JSON.parse(xhr.responseText);
        console.log(imageUrl);
        const image = document.createElement("img");
        image.src = imageUrl.name;
        image.style.width = "100%";
        image.style.height = "400px";
        image.style.marginTop = "10px";
        image.style.marginBottom = "10px";
        resultImage.appendChild(image);
        resultImage.style.display = "block";

        const n = imageUrl.object_n.length;

        for (let i = 0; i < n; i++) {
          // Create the repeat-div
          const repeatDiv = document.createElement("div");
          repeatDiv.classList.add("repeat-div");

          // Create the display-result
          const result = document.createElement("div");
          result.classList.add("display-result");
          const label = document.createElement("p");
          label.textContent = imageUrl.object_n[i];
          const score = document.createElement("p");
          score.textContent = imageUrl.object_s[i];
          result.appendChild(label);
          result.appendChild(score);
          repeatDiv.appendChild(result);

          // Create the progress bar
          const progress = document.createElement("div");
          progress.classList.add("progress");
          progress.style.height = "10px";
          const progressBar = document.createElement("div");
          progressBar.classList.add("progress-bar");
          progressBar.setAttribute("role", "progressbar");
          progressBar.style.width = imageUrl.object_s[i];
          progressBar.setAttribute("aria-valuenow", "25");
          progressBar.setAttribute("aria-valuemin", "0");
          progressBar.setAttribute("aria-valuemax", "100");
          progress.appendChild(progressBar);
          repeatDiv.appendChild(progress);

          // Append the repeat-div to the container
          container.appendChild(repeatDiv);
        }
      }
    };
    xhr.send(formData);
  } else {
    resultImage.innerHTML = "";
  }
}

function loadSample(sample) {
  path = "static/" + sample + ".jpg";

  const image = document.createElement("img");
  image.src = path;
  image.style.width = "100%";
  image.style.height = "400px";
  image.style.marginTop = "10px";
  image.style.marginBottom = "10px";
  resultImage.appendChild(image);
  resultImage.style.display = "block";

  if (sample == "sam1") {
    const repeatDiv = document.createElement("div");
    repeatDiv.classList.add("repeat-div");

    // Create the display-result
    const result = document.createElement("div");
    result.classList.add("display-result");
    const label = document.createElement("p");
    label.textContent = "Baap";
    const score = document.createElement("p");
    score.textContent = "73%";
    result.appendChild(label);
    result.appendChild(score);
    repeatDiv.appendChild(result);

    // Create the progress bar
    const progress = document.createElement("div");
    progress.classList.add("progress");
    progress.style.height = "10px";
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.setAttribute("role", "progressbar");
    progressBar.style.width = "73%";
    progressBar.setAttribute("aria-valuenow", "25");
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", "100");
    progress.appendChild(progressBar);
    repeatDiv.appendChild(progress);

    // Append the repeat-div to the container
    container.appendChild(repeatDiv);
  } else if (sample == "sam2") {
    const repeatDiv = document.createElement("div");
    repeatDiv.classList.add("repeat-div");

    // Create the display-result
    const result = document.createElement("div");
    result.classList.add("display-result");
    const label = document.createElement("p");
    label.textContent = "Bangchung";
    const score = document.createElement("p");
    score.textContent = "52%";
    result.appendChild(label);
    result.appendChild(score);
    repeatDiv.appendChild(result);

    // Create the progress bar
    const progress = document.createElement("div");
    progress.classList.add("progress");
    progress.style.height = "10px";
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.setAttribute("role", "progressbar");
    progressBar.style.width = "52%";
    progressBar.setAttribute("aria-valuenow", "25");
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", "100");
    progress.appendChild(progressBar);
    repeatDiv.appendChild(progress);

    // Append the repeat-div to the container
    container.appendChild(repeatDiv);
  } else {
    const repeatDiv = document.createElement('div');
          repeatDiv.classList.add('repeat-div');
          
          // Create the display-result
          const result = document.createElement('div');
          result.classList.add('display-result');
          const label = document.createElement('p');
          label.textContent = "Jandhom";
          const score = document.createElement('p');
          score.textContent = "88%";
          result.appendChild(label);
          result.appendChild(score);
          repeatDiv.appendChild(result);
          
          // Create the progress bar
          const progress = document.createElement('div');
          progress.classList.add('progress');
          progress.style.height = '10px';
          const progressBar = document.createElement('div');
          progressBar.classList.add('progress-bar');
          progressBar.setAttribute('role', 'progressbar');
          progressBar.style.width = '88%';
          progressBar.setAttribute('aria-valuenow', '25');
          progressBar.setAttribute('aria-valuemin', '0');
          progressBar.setAttribute('aria-valuemax', '100');
          progress.appendChild(progressBar);
          repeatDiv.appendChild(progress);
          
          // Append the repeat-div to the container
          container.appendChild(repeatDiv);
  }
}
