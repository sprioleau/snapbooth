const video = document.querySelector("video");
const videoWrapper = document.getElementById("video-wrapper");
const canvas = document.querySelector("canvas");
const button = document.querySelector("button");
const ctx = canvas.getContext("2d");

let imagesWrapper = document.createElement("div");
let imagesCarousel = document.getElementById("images-carousel");
imagesWrapper.classList.add("images-wrapper");
document.body.appendChild(imagesWrapper);

let imageElements = [];
const videoScale = 0.8;
const MAX_PICTURES = 50;
const picturesPerSecond = 10;

const mediaConfig = {
	video: true,
	audio: false,
};

let stream = await navigator.mediaDevices.getUserMedia(mediaConfig);
video.srcObject = stream;

function takePicture() {
	[canvas.width, canvas.height] = [video.videoWidth * videoScale, video.videoHeight * videoScale];
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

	if (imageElements.length >= MAX_PICTURES) {
		// Stop taking photos
		clearInterval(interval);

		// Remove camera stream
		stream.getTracks().forEach(function (track) {
			track.stop();
    });
    
    videoWrapper.style.background = `url(${imageElements[imageElements.length - 1].src})`;
    videoWrapper.style.backgroundRepeat = "no-repeat";
    videoWrapper.style.backgroundSize = "cover";
    imagesCarousel.style.display = "flex";
    video.style.opacity = 0;
		message.innerText = "Click or tap to snap again!";

		setupRestartListener();

		return;
	}

	const image = document.createElement("img");
	image.src = canvas.toDataURL("image/jpg");
	image.style = `
    --rotation: ${Math.random() * 60 - 60}deg;
    --scale: ${Math.random() * 0.75 + 0.25};
    --x: ${Math.random() * innerWidth}px;
    --y: ${Math.random() * innerHeight}px;`;

	image.onload = () => {
    imageElements.push(image);
    imagesWrapper.appendChild(image);
    const copy = image.cloneNode();
    const imageLink = document.createElement("a");
    imageLink.download = `snapbooth_photo_${Date.now() + "_" + imageElements.length}.jpg`;
    imageLink.href = copy.src;
    copy.style = undefined;
    imageLink.appendChild(copy);
    imagesCarousel.appendChild(imageLink);
	};
}

// button.addEventListener("click", takePicture);
let interval = setInterval(takePicture, 1000 / picturesPerSecond);

function setupRestartListener() {
  // button.removeEventListener("click", takePicture);
	button.addEventListener("click", async function restartCamera() {
		stream = await navigator.mediaDevices.getUserMedia(mediaConfig);
		video.srcObject = stream;

		interval = setInterval(takePicture, 1000 / picturesPerSecond);

    video.style.opacity = 1;
		message.innerText = "Smile!";

		imagesWrapper.remove();
    imageElements = [];
    
		imagesWrapper = document.createElement("div");
		imagesWrapper.classList.add("images-wrapper");
    document.body.appendChild(imagesWrapper);
    
    imagesCarousel.remove();
		imagesCarousel = document.createElement("div");
		imagesCarousel.id = "images-carousel";
    document.body.appendChild(imagesCarousel);
    
    videoWrapper.style.background = "none";

		removeEventListener("click", restartCamera);
	});
}
