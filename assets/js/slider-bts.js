/**
 * 1. SWIPER INITIALIZATION
 * Configures the visual layout and automatic sliding behavior.
 */
var TrandingSlider = new Swiper('.tranding-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 'auto',
    autoplay: {
        delay: 4000, // Time (ms) before moving to next slide
        disableOnInteraction: false, // Continue autoplay even after user swipes manually
    },
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

/**
 * 2. UTILITY FUNCTIONS
 */

// Converts raw seconds (e.g., 95) into a readable string (e.g., "1:35")
function formatTime(time) {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Resets all videos to their starting state (hides video frames, shows thumbnails)
function resetAllVideos(swiper) {
    const allSlides = swiper.el.querySelectorAll('.tranding-slide');
    allSlides.forEach(slide => {
        const video = slide.querySelector('video');
        const overlay = slide.querySelector('.video-overlay');
        const bottomButton = slide.querySelector('.custom-controls .video-play-pause-button');
        const centerButton = slide.querySelector('.video-overlay .center-button');
        const seekBar = slide.querySelector('.seek-bar');

        if (video) {
            video.pause();
            video.currentTime = 0;
            // .load() is crucial: it clears the current frame and resets to the 'poster' image
            video.load(); 
            
            // Reset UI elements to 'Play' state
            if (centerButton) centerButton.querySelector('ion-icon').setAttribute('name', 'play-circle');
            if (bottomButton) bottomButton.querySelector('ion-icon').setAttribute('name', 'play-circle');
            if (overlay) overlay.classList.remove('playing');
            if (seekBar) seekBar.value = 0;
        }
    });
}

/**
 * 3. SWIPER EVENT LISTENERS
 * Triggered when the user or autoplay moves the slider.
 */
TrandingSlider.on('slideChangeTransitionStart', function () {
    // When moving to a new slide, ensure the old video doesn't keep playing in the background
    resetAllVideos(this);
});

/**
 * 4. INDIVIDUAL VIDEO CONTROL SETUP
 * Loops through every slide to attach specific video and UI logic.
 */
document.querySelectorAll('.tranding-slide').forEach(slide => {
    const video = slide.querySelector('video');
    const overlay = slide.querySelector('.video-overlay');
    const bottomButton = slide.querySelector('.custom-controls .video-play-pause-button');
    const centerButton = slide.querySelector('.video-overlay .center-button');
    const seekBar = slide.querySelector('.seek-bar');
    const timeDisplay = slide.querySelector('.time-display');
    const volumeButton = slide.querySelector('.volume-button');
    const volumeBar = slide.querySelector('.volume-bar');

    // Central function to handle Play/Pause toggle
    function togglePlayPause() {
        if (video.paused || video.ended) {
            // Stop other active videos and PAUSE the slider movement
            resetAllVideos(TrandingSlider);
            TrandingSlider.autoplay.stop(); 
            video.play();
        } else {
            video.pause();
            // RESUME slider movement if the user manually pauses the video
            TrandingSlider.autoplay.start();
        }
    }

    // Attach click listeners to UI elements
    if (overlay) overlay.addEventListener('click', togglePlayPause);
    if (bottomButton) bottomButton.addEventListener('click', togglePlayPause);

    /**
     * VIDEO STATE EVENTS
     * Syncs the UI with the actual state of the video player.
     */
    video.addEventListener('play', () => {
        // Prevent slider from swiping away while user is watching
        TrandingSlider.autoplay.stop(); 
        centerButton.querySelector('ion-icon').setAttribute('name', 'pause-circle');
        bottomButton.querySelector('ion-icon').setAttribute('name', 'pause-circle');
        overlay.classList.add('playing');
    });

    video.addEventListener('pause', () => {
        centerButton.querySelector('ion-icon').setAttribute('name', 'play-circle');
        bottomButton.querySelector('ion-icon').setAttribute('name', 'play-circle');
        overlay.classList.remove('playing');
    });

    video.addEventListener('ended', () => {
        // When video finishes, reset to thumbnail and allow slider to move again after the delay
        video.currentTime = 0;
        video.load(); 
        TrandingSlider.autoplay.start(); 
    });

    video.addEventListener('timeupdate', () => {
        // Sync the progress bar and timestamp text as the video plays
        seekBar.value = video.currentTime;
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    });

    video.addEventListener('loadedmetadata', () => {
        // Once video metadata loads, set the seek bar max length
        seekBar.max = video.duration;
        timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
    });

    /**
     * SEEK BAR & VOLUME LOGIC
     */
    seekBar.addEventListener('input', () => {
        // Jump to specific part of the video when dragging the slider
        video.currentTime = seekBar.value;
    });

    // Stop slider from swiping while the user is actively dragging the seek bar
    seekBar.addEventListener('mousedown', () => TrandingSlider.autoplay.stop());
    seekBar.addEventListener('mouseup', () => {
        if (video.paused) TrandingSlider.autoplay.start();
    });

    volumeBar.addEventListener('input', () => {
        video.volume = volumeBar.value;
        // Update volume icon based on level
        volumeButton.querySelector('ion-icon').setAttribute('name', video.volume === 0 ? 'volume-mute' : 'volume-medium');
    });

    // Security/UX: Prevents right-click 'Save Video As' menu download
    video.addEventListener('contextmenu', (e) => e.preventDefault());
});