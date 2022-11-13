// // toggle the image based on the selected image
// let imageList = document.querySelector(".nft-gallery");
// let selectedImage = document.querySelector(".card-image img");

// imageList.addEventListener("click", function (e) {
//   if (e.target.tagName === "IMG") {
//     selectedImage.src = e.target.src;
//   }
// });

// // image grabbing and dragging functionality
// let isDown = false;
// let startX;
// let scrollLeft;

// imageList.addEventListener("mousedown", (e) => {
//   isDown = true;
//   startX = e.pageX - imageList.offsetLeft;
//   scrollLeft = imageList.scrollLeft;
// });
// imageList.addEventListener("mouseleave", () => {
//   isDown = false;
// });
// imageList.addEventListener("mouseup", () => {
//   isDown = false;
// });
// imageList.addEventListener("mousemove", (e) => {
//   if (!isDown) return;
//   e.preventDefault();
//   const x = e.pageX - imageList.offsetLeft;
//   const walk = (x - startX) * 2;
//   imageList.scrollLeft = scrollLeft - walk;
//   // console.log(walk);
// });
