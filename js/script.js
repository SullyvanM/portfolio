document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 01. SÉLECTEURS GLOBAUX
    // =========================================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navIcon = hamburger ? hamburger.querySelector('i') : null;
    const navbar = document.querySelector('.navbar'); 

    // Modale de Détails
    const projectModal = document.getElementById('project-modal');
    const projectCards = document.querySelectorAll('.project-card, .formation-card'); 
    
    // Hobbies
    const btnShowHobbies = document.getElementById('btn-show-hobbies');
    const hobbiesDetails = document.getElementById('hobbies-details');

    // Éléments Modale Détails
    let projectModalCloseBtn = null;
    let modalTitle, modalCompany, modalBody, modalTags;

    if (projectModal) {
        projectModalCloseBtn = projectModal.querySelector('.close-btn');
        modalTitle = document.getElementById('modal-title');
        modalCompany = document.getElementById('modal-company');
        modalBody = document.getElementById('modal-body');
        modalTags = document.getElementById('modal-tags');
    }

    // Sélecteurs Galerie
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

    // Variables État Carrousel
    let currentImages = [];
    let currentPath = ''; 
    let currentIndex = 0;
    let isGalleryMode = false; // Pour savoir si on vient de la grille photo

    // =========================================================
    // 02. NAVIGATION & SCROLL (Inchangé)
    // =========================================================
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

    // =========================================================
    // 03. LOGIQUE GALERIE & MODALES
    // =========================================================

    if (projectModal && galleryModal && galleryContainer) {
        
        // --- FONCTIONS UTILITAIRES ---

        // Affiche une image unique en mode Slider (Zoom)
        const showImageInSlider = (index) => {
            currentIndex = index;
            
            // On nettoie la grille et on prépare le slider
            galleryContainer.innerHTML = `<img id="carousel-image" src="" alt="Zoom" class="carousel-img">`;
            galleryContainer.classList.remove('photo-grid-mode');
            galleryContainer.classList.add('slider-mode');
            galleryContainer.scrollTop = 0;

            const imgElement = document.getElementById('carousel-image');
            imgElement.src = currentPath + currentImages[currentIndex].trim();

            // Affiche les contrôles
            if (prevBtn) prevBtn.style.display = 'block';
            if (nextBtn) nextBtn.style.display = 'block';
            if (imageCounter) {
                imageCounter.style.display = 'block';
                imageCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
            }

            // Si on est en mode "Galerie Photo", on affiche le bouton retour
            if (isGalleryMode && backToGridBtn) {
                backToGridBtn.style.display = 'block';
            }
        };

        // Reconstruit la Grille (appelé à l'ouverture ou au retour)
        const buildGrid = () => {
            galleryContainer.innerHTML = '';
            galleryContainer.classList.remove('slider-mode');
            galleryContainer.classList.add('photo-grid-mode');

            // Masque les contrôles slider
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (imageCounter) imageCounter.style.display = 'none';
            if (backToGridBtn) backToGridBtn.style.display = 'none';

            let imageHTML = '';
            currentImages.forEach((imageName, index) => {
                // On ajoute un data-index pour savoir sur quelle image on clique
                imageHTML += `
                    <div class="photo-item" data-index="${index}">
                        <img src="${currentPath}${imageName.trim()}" alt="Photographie" loading="lazy">
                    </div>`;
            });
            galleryContainer.innerHTML = imageHTML;

            // Ajout des écouteurs de clic sur chaque image de la grille
            document.querySelectorAll('.photo-item').forEach(item => {
                item.addEventListener('click', function() {
                    const indexClick = parseInt(this.getAttribute('data-index'));
                    showImageInSlider(indexClick);
                });
            });
        };


        // --- GESTION DES CLICS SUR LES CARTES ---
        
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a') || e.target.closest('button')) return;

                const galleryPathAttr = card.getAttribute('data-gallery-path');
                const galleryImagesAttr = card.getAttribute('data-gallery-images');

                // === CAS 1 : MODE GALERIE PHOTO (Grille) ===
                if (galleryPathAttr && galleryImagesAttr) {
                    currentPath = galleryPathAttr;
                    currentImages = galleryImagesAttr.split(',');
                    isGalleryMode = true; // On retient qu'on est en mode photo

                    buildGrid(); // Construit et affiche la grille
                    galleryModal.style.display = 'flex';
                    return;
                }

                // === CAS 2 : MODALE PROJET CLASSIQUE ===
                const title = card.querySelector('h3').innerText;
                const company = card.querySelector('.company').innerText;
                const hiddenDetails = card.querySelector('.hidden-details');
                const descriptionHTML = hiddenDetails ? hiddenDetails.innerHTML : card.querySelector('p:not(.company)').innerHTML;
                const tags = card.querySelector('.tags') ? card.querySelector('.tags').innerHTML : '';

                modalTitle.innerText = title;
                modalCompany.innerText = company;
                modalBody.innerHTML = descriptionHTML;
                modalTags.innerHTML = tags;
                projectModal.style.display = 'flex';
            });
        });

        // --- NAVIGATION SLIDER (Next/Prev) ---
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

        // --- GESTION BOUTON "VOIR CAPTURES" (Modélisation 3D) ---
        document.addEventListener('click', (e) => {
            const openGalleryBtn = e.target.closest('.open-gallery-btn');
            if (openGalleryBtn) {
                e.stopPropagation();
                if (projectModal) projectModal.style.display = 'none';

                // Config pour la 3D
                const imagesString = openGalleryBtn.getAttribute('data-images') || '';
                currentImages = imagesString ? imagesString.split(',') : [];
                currentPath = 'assets/images/projets/modelisation/'; 
                isGalleryMode = false; // Ce n'est pas la galerie photo, pas besoin de bouton "Retour"

                if (currentImages.length > 0) {
                    showImageInSlider(0); // Ouvre directement le slider
                    galleryModal.style.display = 'flex';
                }
            }
        });

        // --- GESTION BOUTON RETOUR GRILLE ---
        if (backToGridBtn) {
            backToGridBtn.addEventListener('click', () => {
                buildGrid(); // Reconstruit la grille
            });
        }

        // --- FERMETURE ---
        const closeAll = () => {
            projectModal.style.display = 'none';
            galleryModal.style.display = 'none';
            // Reset
            galleryContainer.classList.remove('slider-mode');
            galleryContainer.classList.remove('photo-grid-mode');
        };

        if (projectModalCloseBtn) projectModalCloseBtn.addEventListener('click', () => projectModal.style.display = 'none');
        
        if (galleryCloseBtn) galleryCloseBtn.addEventListener('click', closeAll);

        window.addEventListener('click', (e) => {
            if (e.target === projectModal) projectModal.style.display = 'none';
            if (e.target === galleryModal) closeAll();
        });

        // --- CLAVIER ---
        document.addEventListener('keydown', (e) => {
            if (galleryModal.style.display === 'flex' && galleryContainer.classList.contains('slider-mode')) {
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
                if (e.key === 'Escape') {
                    // Si on est en mode zoom photo, Echap revient à la grille, sinon ferme
                    if (isGalleryMode) {
                         buildGrid();
                    } else {
                         closeAll();
                    }
                }
            } else if (e.key === 'Escape') {
                closeAll();
            }
        });

        // Hobbies
        if (btnShowHobbies) {
            btnShowHobbies.addEventListener('click', () => {
                modalTitle.innerText = "Mes Hobbies";
                modalCompany.innerText = "";
                modalBody.innerHTML = hobbiesDetails.innerHTML;
                modalTags.innerHTML = `<span>Personnel</span><span>Détente</span><span>Sport</span>`;
                projectModal.style.display = 'flex';
            });
        }
    }
});