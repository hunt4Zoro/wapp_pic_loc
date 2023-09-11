window.addEventListener('DOMContentLoaded', (event) => {
  const captureBtn = document.getElementById('capture-btn');
  const previewContainer = document.getElementById('preview-container');
  const locationDisplay = document.getElementById('location');

  captureBtn.addEventListener('click', () => {
    captureAndSavePhoto();
    getLocation();
  });

  function captureAndSavePhoto() {
    const constraints = { video: { facingMode: 'environment' } };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(mediaStream) {
        const video = document.createElement('video');
        video.srcObject = mediaStream;
        video.autoplay = true;
        previewContainer.innerHTML = '';
        previewContainer.appendChild(video);

        video.addEventListener('loadeddata', function() {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
          const imageDataUrl = canvas.toDataURL('image/jpeg');
          savePhotoLocally(imageDataUrl);
          video.srcObject = null; // Stop the video stream
        });
      })
      .catch(function(err) {
        console.error('Error accessing camera:', err);
      });
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      locationDisplay.textContent = 'Geolocation is not supported by this browser.';
    }
  }

  function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    locationDisplay.textContent = `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`;
  }

  function savePhotoLocally(imageDataUrl) {
    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = 'photo.jpg';
    link.click();
  }
});
