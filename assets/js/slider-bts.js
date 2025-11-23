var TrandingSlider = new Swiper('.tranding-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
});

// -----------------------------------------------------------------
// Custom Video Control Functionality (कस्टम वीडियो नियंत्रण कार्यक्षमता)
// -----------------------------------------------------------------

// Helper function to format time (समय को फॉर्मेट करने के लिए सहायक फंक्शन)
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function to stop all videos (सभी वीडियो को रोकने का फंक्शन)
function stopAllVideos(swiper) {
    const allSlides = swiper.el.querySelectorAll('.tranding-slide');
    allSlides.forEach(slide => {
        const video = slide.querySelector('video');
        const centerButton = slide.querySelector('.video-overlay .center-button');
        const overlay = slide.querySelector('.video-overlay');
        const bottomButton = slide.querySelector('.custom-controls .video-play-pause-button');
        const timeDisplay = slide.querySelector('.time-display');
        const seekBar = slide.querySelector('.seek-bar');

        if (video && !video.paused) {
            video.pause();
            video.currentTime = 0; // Rewind video to start
            
            // Update UI
            if (centerButton) centerButton.querySelector('ion-icon').setAttribute('name', 'play-circle');
            if (bottomButton) bottomButton.querySelector('ion-icon').setAttribute('name', 'play-circle');
            if (overlay) overlay.classList.remove('playing');
            if (timeDisplay) timeDisplay.textContent = '0:00 / 0:00';
            if (seekBar) seekBar.value = 0;
        }
    });
}

// Add event listener for slide changes (स्लाइड बदलने पर इवेंट लिसनर)
TrandingSlider.on('slideChangeTransitionStart', function () {
    stopAllVideos(this);
});


// Setup listeners for each video (हर वीडियो के लिए लिसनर सेट करें)
document.querySelectorAll('.tranding-slide').forEach(slide => {
    const video = slide.querySelector('video');
    const centerButton = slide.querySelector('.video-overlay .center-button');
    const overlay = slide.querySelector('.video-overlay');
    const customControls = slide.querySelector('.custom-controls');
    
    // Bottom controls
    const bottomButton = slide.querySelector('.custom-controls .video-play-pause-button');
    const timeDisplay = slide.querySelector('.time-display');
    const seekBar = slide.querySelector('.seek-bar');
    const volumeButton = slide.querySelector('.volume-button');
    const volumeBar = slide.querySelector('.volume-bar');
    
    // -------------------------------------
    // 1. Play/Pause Logic (प्ले/पॉज लॉजिक)
    // -------------------------------------
    function togglePlayPause() {
        if (video.paused || video.ended) {
            stopAllVideos(TrandingSlider); // Stop others before playing
            video.play();
        } else {
            video.pause();
        }
    }

    if (video && centerButton && bottomButton) {
        // Center button and overlay click toggles play/pause
        overlay.addEventListener('click', togglePlayPause);
        bottomButton.addEventListener('click', togglePlayPause);
    }
    
    // Video Event Listeners (वीडियो इवेंट लिसनर)
    video.addEventListener('loadedmetadata', () => {
        seekBar.max = video.duration;
        timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
    });

    video.addEventListener('play', () => {
        centerButton.querySelector('ion-icon').setAttribute('name', 'pause-circle');
        bottomButton.querySelector('ion-icon').setAttribute('name', 'pause-circle');
        overlay.classList.add('playing');
    });

    video.addEventListener('pause', () => {
        centerButton.querySelector('ion-icon').setAttribute('name', 'play-circle');
        bottomButton.querySelector('ion-icon').setAttribute('name', 'play-circle');
        overlay.classList.remove('playing');
        customControls.classList.add('visible'); // Show controls when paused
    });

    video.addEventListener('timeupdate', () => {
        seekBar.value = video.currentTime;
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    });

    video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.pause();
    });

    // -------------------------------------
    // 2. Seek Bar (ट्रैक बार)
    // -------------------------------------
    seekBar.addEventListener('input', () => {
        video.currentTime = seekBar.value;
    });

    // -------------------------------------
    // 3. Volume Controls (वॉल्यूम कंट्रोल्स)
    // -------------------------------------
    volumeBar.addEventListener('input', () => {
        video.volume = volumeBar.value;
        if (video.volume === 0) {
            volumeButton.querySelector('ion-icon').setAttribute('name', 'volume-mute');
        } else {
            volumeButton.querySelector('ion-icon').setAttribute('name', 'volume-medium');
        }
    });

    volumeButton.addEventListener('click', () => {
        if (video.volume > 0) {
            video.volume = 0;
            volumeBar.value = 0;
            volumeButton.querySelector('ion-icon').setAttribute('name', 'volume-mute');
        } else {
            video.volume = 1;
            volumeBar.value = 1;
            volumeButton.querySelector('ion-icon').setAttribute('name', 'volume-medium');
        }
    });

    // -------------------------------------
    // 4. Prevent Download (डाउनलोड रोकें)
    // -------------------------------------
    video.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Prevent right-click context menu
    });
});