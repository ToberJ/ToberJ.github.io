// Load publications from JSON
let publicationsData = [];
let showSelected = true;

// === Customize this to bold your own name in the author list ===
const MY_NAME = 'Taoyang Jia';

async function loadPublications() {
    try {
        let response;
        const possiblePaths = [
            'publications.json',
            '/publications.json',
            './publications.json'
        ];

        for (const path of possiblePaths) {
            try {
                response = await fetch(path);
                if (response.ok) break;
            } catch (e) {
                continue;
            }
        }

        if (!response || !response.ok) {
            throw new Error('Could not load publications.json');
        }

        const data = await response.json();
        publicationsData = data.publications;
        displayPublications();
    } catch (error) {
        console.error('Error loading publications:', error);
        const container = document.getElementById('publicationsList');
        if (container) {
            container.innerHTML = '<p style="color: #dc2626;">Error loading publications. Please check the console for details.</p>';
        }
    }
}

function displayPublications() {
    const container = document.getElementById('publicationsList');
    if (!container) return;

    const publications = showSelected
        ? publicationsData.filter(pub => pub.selected)
        : publicationsData;

    container.innerHTML = publications.map(pub => createPublicationHTML(pub)).join('');
    observePublicationVideos(container);
}

let publicationVideoObserver = null;

function observePublicationVideos(container) {
    if (publicationVideoObserver) publicationVideoObserver.disconnect();
    const videos = container.querySelectorAll('.publication-video-trigger video');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) return;

    publicationVideoObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
            const video = entry.target;
            if (entry.isIntersecting) {
                const playing = video.play();
                if (playing) playing.catch(() => {});
            } else {
                video.pause();
            }
        }
    }, { threshold: 0.35 });
    videos.forEach(video => publicationVideoObserver.observe(video));
}

function initializePublicationVideoLightbox(container) {
    // The preview stays muted; users may unmute the enlarged video.
    const dialog = document.createElement('dialog');
    dialog.className = 'publication-video-lightbox';
    dialog.innerHTML = `<button type="button" class="publication-video-close" aria-label="Close video">Close ×</button>
                        <video controls muted loop playsinline></video>`;
    document.body.appendChild(dialog);
    const fullVideo = dialog.querySelector('video');
    const close = () => {
        fullVideo.pause();
        fullVideo.removeAttribute('src');
        fullVideo.load();
        if (dialog.open) dialog.close();
    };
    dialog.querySelector('.publication-video-close').addEventListener('click', close);
    dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
    dialog.addEventListener('close', () => {
        fullVideo.pause();
        fullVideo.removeAttribute('src');
        fullVideo.load();
    });
    container.addEventListener('click', event => {
        const button = event.target.closest('.publication-video-trigger');
        if (!button || !container.contains(button)) return;
        const preview = button.querySelector('video');
        if (preview) preview.pause();
        fullVideo.src = button.dataset.videoSrc;
        dialog.showModal();
        const playing = fullVideo.play();
        if (playing) playing.catch(() => {});
    });
}

function createPublicationHTML(pub) {
    const authorsHtml = pub.authors.map(author =>
        author.includes(MY_NAME) ? `<strong>${author}</strong>` : author
    ).join(', ');

    // Order: arXiv / Paper first, then Code, then others
    const linkOrder = ['arxiv', 'paper', 'code', 'website', 'huggingface', 'demo', 'blog', 'talk', 'data', 'models'];
    const linkLabels = {
        'paper': 'Paper',
        'arxiv': 'arXiv',
        'website': 'Website',
        'code': 'Code',
        'huggingface': 'HuggingFace',
        'demo': 'Demo',
        'blog': 'Blog',
        'talk': 'Talk',
        'data': 'Data',
        'models': 'Models'
    };

    const linksHtml = linkOrder
        .filter(key => pub.links && pub.links[key])
        .map(key => {
            const label = (pub.link_labels && pub.link_labels[key]) || linkLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
            return `<a href="${pub.links[key]}" target="_blank">${label}</a>`;
        })
        .join('');

    let imageHtml = '';
    if (pub.video && /\\.(mp4|webm)(\\?.*)?$/i.test(pub.video)) {
        const videoType = /\\.webm(\\?|$)/i.test(pub.video) ? 'video/webm' : 'video/mp4';
        imageHtml = `<button type="button"
                         class="publication-image publication-video publication-video-trigger"
                         data-video-src="${pub.video}"
                         aria-label="Expand video for ${pub.title}">
                         <video muted loop playsinline preload="metadata" ${pub.image ? `poster="${pub.image}"` : ''}>
                           <source src="${pub.video}" type="${videoType}">
                         </video>
                         <span class="publication-video-expand" aria-hidden="true">↗ Expand</span>
                       </button>`;
    } else if (pub.video) {
        // Keep support for YouTube videos used by other publication entries.
        let videoId = '';
        if (pub.video.includes('youtube.com') || pub.video.includes('youtu.be')) {
            try {
                const parsed = new URL(pub.video);
                videoId = parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
            } catch (e) {
                videoId = pub.video.split('/').pop().split('?')[0];
            }
        }
        if (videoId) {
            imageHtml = `<div class="publication-image publication-video">
                           <iframe
                             src="https://www.youtube-nocookie.com/embed/${videoId}?mute=1&loop=1&playlist=${videoId}&playsinline=1"
                             title="${pub.title} demo video"
                             loading="lazy"
                             allow="autoplay; encrypted-media; picture-in-picture"
                             allowfullscreen>
                           </iframe>
                         </div>`;
        }
    } else if (pub.image) {
        imageHtml = `<div class="publication-image">
                       <img src="${pub.image}" alt="${pub.title}">
                     </div>`;
    }

    const additionalVenueHtml = pub.additional_venue ? `<br>& ${pub.additional_venue}` : '';

    const tldrHtml = pub.tldr ? `
        <div class="publication-tldr collapsed" id="tldr-${pub.id}">
            <div class="tldr-content">
                <strong>TL;DR:</strong> ${pub.tldr}
            </div>
            <button class="tldr-toggle" onclick="toggleTldr('${pub.id}')" aria-label="Expand">
                <span class="toggle-text">more</span>
                <svg class="toggle-icon" width="12" height="12" viewBox="0 0 12 12">
                    <path d="M6 9L3 6h6z" fill="currentColor"/>
                </svg>
            </button>
        </div>
    ` : '';

    return `
        <div class="publication-item">
            ${imageHtml}
            <div class="publication-content">
                <div class="publication-title">
                    <a href="${pub.links?.website || pub.links?.paper || pub.links?.arxiv || '#'}" target="_blank">${pub.title}</a>
                </div>
                <div class="publication-authors">${authorsHtml}</div>
                <div class="publication-venue">
                    <strong>${pub.venue}</strong> ${pub.year}${additionalVenueHtml}
                </div>
                ${linksHtml ? `<div class="publication-links">${linksHtml}</div>` : ''}
                ${tldrHtml}
            </div>
        </div>
    `;
}

function toggleTldr(pubId) {
    const tldrElement = document.getElementById(`tldr-${pubId}`);
    if (!tldrElement) return;

    const isCollapsed = tldrElement.classList.contains('collapsed');

    if (isCollapsed) {
        tldrElement.classList.remove('collapsed');
        tldrElement.classList.add('expanded');
        const toggleBtn = tldrElement.querySelector('.tldr-toggle .toggle-text');
        if (toggleBtn) toggleBtn.textContent = 'less';
    } else {
        tldrElement.classList.add('collapsed');
        tldrElement.classList.remove('expanded');
        const toggleBtn = tldrElement.querySelector('.tldr-toggle .toggle-text');
        if (toggleBtn) toggleBtn.textContent = 'more';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPublications();
    const publicationList = document.getElementById('publicationsList');
    if (publicationList) initializePublicationVideoLightbox(publicationList);

    const selectedBtn = document.getElementById('selectedBtn');
    const allBtn = document.getElementById('allBtn');

    if (selectedBtn && allBtn) {
        selectedBtn.addEventListener('click', () => {
            showSelected = true;
            selectedBtn.classList.add('active');
            allBtn.classList.remove('active');
            displayPublications();
        });

        allBtn.addEventListener('click', () => {
            showSelected = false;
            allBtn.classList.add('active');
            selectedBtn.classList.remove('active');
            displayPublications();
        });
    }
});
