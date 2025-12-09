document.addEventListener('DOMContentLoaded', () => {

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navIcon = hamburger ? hamburger.querySelector('i') : null;
    const navbar = document.querySelector('.navbar');

    const projectModal = document.getElementById('project-modal');
    const projectCards = document.querySelectorAll('.project-card, .formation-card');

    const btnShowHobbies = document.getElementById('btn-show-hobbies');
    const btnShowLanguages = document.getElementById('btn-show-languages');

    const hobbiesDetails = document.getElementById('hobbies-details');
    const languagesDetails = document.getElementById('languages-details');

    let projectModalCloseBtn = null;
    let modalTitle, modalCompany, modalBody, modalTags;

    if (projectModal) {
        projectModalCloseBtn = projectModal.querySelector('.close-btn');
        modalTitle = document.getElementById('modal-title');
        modalCompany = document.getElementById('modal-company');
        modalBody = document.getElementById('modal-body');
        modalTags = document.getElementById('modal-tags');
    }

    const galleryModal = document.getElementById('gallery-modal');
    const galleryContainer = galleryModal ? galleryModal.querySelector('.carousel-container') : null;

    let galleryCloseBtn = null;
    let prevBtn = null;
    let nextBtn = null;
    let imageCounter = null;
    let backToGridBtn = null;

    if (galleryModal) {
        galleryCloseBtn = galleryModal.querySelector('.gallery-close-btn');
        prevBtn = document.getElementById('prev-btn');
        nextBtn = document.getElementById('next-btn');
        imageCounter = document.getElementById('image-counter');
        backToGridBtn = document.getElementById('back-to-grid');
    }

    let currentImages = [];
    let currentPath = '';
    let currentIndex = 0;
    let isGalleryMode = false;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (navIcon) { navIcon.classList.remove('fa-times'); navIcon.classList.add('fa-bars'); }
            }
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    window.addEventListener('scroll', () => {
        if (navbar) navbar.style.background = window.scrollY > 50 ? 'rgba(18, 18, 18, 1)' : 'rgba(18, 18, 18, 0.95)';
    });

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (navIcon) { navIcon.classList.toggle('fa-bars'); navIcon.classList.toggle('fa-times'); }
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (navIcon) { navIcon.classList.add('fa-bars'); navIcon.classList.remove('fa-times'); }
            });
        });
    }

    const showImageInSlider = (index) => {
        if (!galleryContainer) return;
        currentIndex = index;

        galleryContainer.innerHTML = `<img id="carousel-image" src="" alt="Zoom" class="carousel-img">`;
        galleryContainer.classList.remove('photo-grid-mode');
        galleryContainer.classList.add('slider-mode');
        galleryContainer.scrollTop = 0;

        const imgElement = document.getElementById('carousel-image');
        if (imgElement) imgElement.src = currentPath + currentImages[currentIndex].trim();

        if (prevBtn) prevBtn.style.display = 'block';
        if (nextBtn) nextBtn.style.display = 'block';
        if (imageCounter) {
            imageCounter.style.display = 'block';
            imageCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        }
        if (isGalleryMode && backToGridBtn) {
            backToGridBtn.style.display = 'block';
        }
    };

    const buildGrid = () => {
        if (!galleryContainer) return;

        galleryContainer.innerHTML = '';
        galleryContainer.classList.remove('slider-mode');
        galleryContainer.classList.add('photo-grid-mode');

        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (imageCounter) imageCounter.style.display = 'none';
        if (backToGridBtn) backToGridBtn.style.display = 'none';

        let imageHTML = '';
        currentImages.forEach((imageName, index) => {
            imageHTML += `
                <div class="photo-item" data-index="${index}">
                    <img src="${currentPath}${imageName.trim()}" alt="Photographie" loading="lazy">
                </div>`;
        });
        galleryContainer.innerHTML = imageHTML;

        document.querySelectorAll('.photo-item').forEach(item => {
            item.addEventListener('click', function() {
                const indexClick = parseInt(this.getAttribute('data-index'));
                showImageInSlider(indexClick);
            });
        });
    };

    if (galleryModal && galleryContainer) {

        const updateSliderImage = () => {
            const imgElement = document.getElementById('carousel-image');
            if (imgElement) {
                imgElement.src = currentPath + currentImages[currentIndex].trim();
                if(imageCounter) imageCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
            }
        };

        if (prevBtn) prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateSliderImage();
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateSliderImage();
        });

        if (backToGridBtn) {
            backToGridBtn.addEventListener('click', () => {
                buildGrid();
            });
        }

        document.addEventListener('click', (e) => {
            const openGalleryBtn = e.target.closest('.open-gallery-btn');
            if (openGalleryBtn) {
                e.stopPropagation();
                if (projectModal) projectModal.style.display = 'none';

                const imagesString = openGalleryBtn.getAttribute('data-images') || '';
                currentImages = imagesString ? imagesString.split(',') : [];
                currentPath = 'assets/images/projets/modelisation/';
                isGalleryMode = false;

                if (currentImages.length > 0) {
                    showImageInSlider(0);
                    galleryModal.style.display = 'flex';
                }
            }
        });
    }

    if (projectCards.length > 0) {
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a') || e.target.closest('button')) return;

                const galleryPathAttr = card.getAttribute('data-gallery-path');
                const galleryImagesAttr = card.getAttribute('data-gallery-images');

                if (galleryPathAttr && galleryImagesAttr && galleryModal && galleryContainer) {
                    currentPath = galleryPathAttr;
                    currentImages = galleryImagesAttr.split(',');
                    isGalleryMode = true;

                    buildGrid();
                    galleryModal.style.display = 'flex';
                    return;
                }

                if (projectModal) {
                    const titleElement = card.querySelector('h3');
                    const companyElement = card.querySelector('.company');

                    if (!titleElement) return;

                    const title = titleElement.innerText;
                    const company = companyElement ? companyElement.innerText : '';

                    const hiddenDetails = card.querySelector('.hidden-details');
                    let descriptionHTML = '';

                    if (hiddenDetails) {
                        descriptionHTML = hiddenDetails.innerHTML;
                    } else {
                        const pDesc = card.querySelector('p:not(.company)');
                        if(pDesc) descriptionHTML = pDesc.innerHTML;
                    }

                    const tagsElement = card.querySelector('.tags');
                    const tags = tagsElement ? tagsElement.innerHTML : '';

                    if (modalTitle) modalTitle.innerText = title;
                    if (modalCompany) modalCompany.innerText = company;
                    if (modalBody) modalBody.innerHTML = descriptionHTML;
                    if (modalTags) modalTags.innerHTML = tags;

                    projectModal.style.display = 'flex';
                }
            });
        });
    }

    const closeGallery = () => {
        if (!galleryModal) return;
        galleryModal.style.display = 'none';
        if (galleryContainer) {
            galleryContainer.classList.remove('slider-mode');
            galleryContainer.classList.remove('photo-grid-mode');
        }
    };

    if (projectModalCloseBtn) {
        projectModalCloseBtn.addEventListener('click', () => {
            projectModal.style.display = 'none';
        });
    }

    if (galleryCloseBtn) {
        galleryCloseBtn.addEventListener('click', closeGallery);
    }

    window.addEventListener('click', (e) => {
        if (projectModal && e.target === projectModal) {
            projectModal.style.display = 'none';
        }
        if (galleryModal && e.target === galleryModal) {
            closeGallery();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (galleryModal && galleryModal.style.display === 'flex') {
            if (galleryContainer && galleryContainer.classList.contains('slider-mode')) {
                if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
                if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
            }
            if (e.key === 'Escape') {
                if (isGalleryMode && galleryContainer && galleryContainer.classList.contains('slider-mode')) {
                    buildGrid();
                } else {
                    closeGallery();
                }
            }
        }
        else if (projectModal && projectModal.style.display === 'flex') {
            if (e.key === 'Escape') projectModal.style.display = 'none';
        }
    });

    if (btnShowHobbies && projectModal) {
        btnShowHobbies.addEventListener('click', () => {
            if (modalTitle) modalTitle.innerText = "Mes Hobbies & Passions";
            if (modalCompany) modalCompany.innerText = "";
            if (modalBody) modalBody.innerHTML = hobbiesDetails.innerHTML;
            if (modalTags) modalTags.innerHTML = `
                <span>Personnel</span>
                <span>Détente</span>
                <span>Sport</span>
            `;
            projectModal.style.display = 'flex';
        });
    }

    if (btnShowLanguages && projectModal) {
        btnShowLanguages.addEventListener('click', () => {
            if (modalTitle) modalTitle.innerText = "Mes Langues";
            if (modalCompany) modalCompany.innerText = "";
            if (modalBody) modalBody.innerHTML = languagesDetails.innerHTML;
            if (modalTags) modalTags.innerHTML = `
                <span>Communication</span>
                <span>International</span>
            `;
            projectModal.style.display = 'flex';
        });
    }

});