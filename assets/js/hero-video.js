/**
 * Hero Video Section JavaScript - YouTube Integration
 * Handles YouTube video embedding and custom play button functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const videoOverlay = document.getElementById('video-overlay');
    const customPlayBtn = document.getElementById('custom-play-btn');
    const youtubeIframe = document.getElementById('hero-youtube-video');
    
    // YouTube API integration
    let player;
    let isPlayerReady = false;

    // Load YouTube IFrame API
    function loadYouTubeAPI() {
        if (window.YT && window.YT.Player) {
            initializePlayer();
            return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Initialize YouTube player when API is ready
    window.onYouTubeIframeAPIReady = function() {
        initializePlayer();
    };

    function initializePlayer() {
        if (!youtubeIframe) return;

        player = new YT.Player('hero-youtube-video', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerReady(event) {
        isPlayerReady = true;
        console.log('YouTube player is ready');
    }

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            // Hide overlay when video starts playing
            if (videoOverlay) {
                videoOverlay.classList.add('hidden');
            }
        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            // Show overlay when video is paused or ended
            if (videoOverlay) {
                videoOverlay.classList.remove('hidden');
            }
        }
    }

    // Custom play button functionality
    if (customPlayBtn && videoOverlay) {
        customPlayBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isPlayerReady && player) {
                // Play YouTube video
                player.playVideo();
                videoOverlay.classList.add('hidden');
            } else {
                // Fallback: Load YouTube API if not loaded
                loadYouTubeAPI();
                
                // Hide overlay and show iframe
                videoOverlay.classList.add('hidden');
                
                // Try to play after a short delay
                setTimeout(function() {
                    if (isPlayerReady && player) {
                        player.playVideo();
                    }
                }, 1000);
            }
        });

        // Add hover effects
        customPlayBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        customPlayBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Initialize YouTube API
    loadYouTubeAPI();

    // Smooth scrolling for navigation links
    const scrollLinks = document.querySelectorAll('.scroll-to-section');
    scrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe video section elements
    const videoElements = document.querySelectorAll('.video-container, .feature-item, .section-heading');
    videoElements.forEach(function(element) {
        observer.observe(element);
    });

    // Pause video when scrolling away (performance optimization)
    const videoSectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting && isPlayerReady && player) {
                // Pause video when section is not visible
                const playerState = player.getPlayerState();
                if (playerState === YT.PlayerState.PLAYING) {
                    player.pauseVideo();
                }
            }
        });
    }, { threshold: 0.25 });

    const heroVideoSection = document.querySelector('.hero-video-section');
    if (heroVideoSection) {
        videoSectionObserver.observe(heroVideoSection);
    }

    // Handle responsive video sizing
    function handleVideoResize() {
        const videoWrapper = document.querySelector('.video-wrapper');
        if (videoWrapper && window.innerWidth <= 768) {
            // Adjust video wrapper for mobile
            videoWrapper.style.paddingBottom = '56.25%'; // Maintain 16:9 ratio
        }
    }

    window.addEventListener('resize', handleVideoResize);
    handleVideoResize(); // Initial call

    // Add loading state management
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
        videoContainer.classList.add('loading');
        
        // Remove loading state after a delay or when player is ready
        const removeLoading = function() {
            videoContainer.classList.remove('loading');
        };

        if (isPlayerReady) {
            removeLoading();
        } else {
            setTimeout(removeLoading, 3000); // Fallback timeout
        }
    }

    // Add CSS class for JavaScript-enabled features
    document.documentElement.classList.add('js-enabled');
});

// Additional CSS for enhanced functionality
const enhancedCSS = `
.video-container.loading::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    border: 3px solid rgba(75, 142, 241, 0.3);
    border-top: 3px solid #4b8ef1;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: spin 1s linear infinite;
    z-index: 15;
}

@keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.animate-in {
    animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Enhanced video overlay transitions */
.video-overlay {
    transition: opacity 0.5s ease, visibility 0.5s ease;
}

.video-overlay.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}

/* Smooth hover transitions */
.play-button {
    transition: transform 0.3s ease;
}

.play-button:hover {
    transform: scale(1.05);
}

/* Responsive enhancements */
@media (max-width: 768px) {
    .video-overlay {
        background: linear-gradient(135deg, rgba(75, 142, 241, 0.9) 0%, rgba(91, 104, 235, 0.8) 100%);
    }
}

/* Hide elements initially for animation */
.js-enabled .video-container,
.js-enabled .feature-item {
    opacity: 0;
    transform: translateY(30px);
}

.js-enabled .video-container.animate-in,
.js-enabled .feature-item.animate-in {
    opacity: 1;
    transform: translateY(0);
}
`;

// Inject enhanced CSS
const style = document.createElement('style');
style.textContent = enhancedCSS;
document.head.appendChild(style);
