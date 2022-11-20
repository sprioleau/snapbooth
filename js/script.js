const video = document.querySelector("video");
			const canvas = document.querySelector("canvas");
			const button = document.querySelector("button");
			const ctx = canvas.getContext("2d");
			let images = [];
			const videoScale = 0.8;
			const MAX_PICTURES = 100;
			const picturesPerSecond = 10;

			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false,
			});

			video.srcObject = stream;

			function takePicture() {
				[canvas.width, canvas.height] = [video.videoWidth * videoScale, video.videoHeight * videoScale];
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				const image = document.createElement("img");
				image.src = canvas.toDataURL("image/jpg");
				image.style = `
         --rotation: ${Math.random() * 360}deg;
         --scale: ${Math.random() * 0.75 + 0.45};
         --x: ${Math.random() * innerWidth}px;
         --y: ${Math.random() * innerHeight}px;`;

				image.onload = () => {
					images.push(image);

					if (images.length > MAX_PICTURES) {
						clearInterval(interval);
						stream.getTracks().forEach(function (track) {
							track.stop();
						});
						button.style.display = "none";
						button.style.pointerEvents = "none";
					} else {
						document.body.appendChild(image);
					}
				};
			}

			button.addEventListener("click", takePicture);
			const interval = setInterval(takePicture, 1000 / picturesPerSecond);