
    document.addEventListener('DOMContentLoaded', function() {
      const galleryImages = document.querySelectorAll('.gallery-container img');
      const fullscreenOverlay = document.getElementById('fullscreenOverlay');
      const fullscreenImage = document.getElementById('fullscreenImage');
      const closeButton = document.getElementById('closeButton');

      galleryImages.forEach(image => {
        image.addEventListener('click', function() {
          fullscreenImage.src = this.src;
          fullscreenImage.alt = this.alt;
          fullscreenOverlay.classList.add('active');
        });
      });

      closeButton.addEventListener('click', function() {
        fullscreenOverlay.classList.remove('active');
      });

      fullscreenOverlay.addEventListener('click', function(e) {
        if (e.target === fullscreenOverlay) {
          fullscreenOverlay.classList.remove('active');
        }
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && fullscreenOverlay.classList.contains('active')) {
          fullscreenOverlay.classList.remove('active');
        }
      });
    });
  