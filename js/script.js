document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 01. SÉLECTEURS GLOBAUX
    // =========================================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navIcon = hamburger ? hamburger.querySelector('i') : null;

    // Navbar
    const navbar = document.querySelector('.navbar'); 

    // Modale de Détails (Projets/Formations/Hobbies)
    const projectModal = document.getElementById('project-modal');
    // Sélecteur général pour les cartes projet
    const projectCards = document.querySelectorAll('.project-card, .formation-card'); 
    
    // Hobbies (pour la page d'accueil)
    const btnShowHobbies = document.getElementById('btn-show-hobbies');
    const hobbiesDetails = document.getElementById('hobbies-details');

    // Éléments de la Modale de Détails
    let projectModalCloseBtn = null;
    let modalTitle = null;
    let modalCompany = null;
    let modalBody = null;
    let modalTags = null;

    if (projectModal) {
        projectModalCloseBtn = projectModal.querySelector('.close-btn');
        modalTitle = document.getElementById('modal-title');
        modalCompany = document.getElementById('modal-company');
        modalBody = document.getElementById('modal-body');
        modalTags = document.getElementById('modal-tags');
    }

    // Sélecteurs de la Modale Galerie
    const galleryModal = document.getElementById('gallery-modal');
    const galleryContainer = galleryModal ? galleryModal.querySelector('.carousel-container') : null;
    
    let galleryCloseBtn = null;
    let carouselImage = null;
    let prevBtn = null;
    let nextBtn = null;
    let imageCounter = null;

    if (galleryModal) {
        galleryCloseBtn = galleryModal.querySelector('.gallery-close-btn');
        carouselImage = document.getElementById('carousel-image');
        prevBtn = document.getElementById('prev-btn');
        nextBtn = document.getElementById('next-btn');
        imageCounter = document.getElementById('image-counter');
    }

    // Variables pour le Carrousel (utilisé par la Modélisation 3D)
    let currentImages = [];
    let currentPath = ''; 
    let currentIndex = 0;


    // =========================================================
    // 02. NAVIGATION & SCROLL
    // =========================================================

    // Smooth Scroll & Fermeture Menu Mobile
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Si le menu mobile est ouvert, le fermer
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (navIcon) {
                    navIcon.classList.remove('fa-times');
                    navIcon.classList.add('fa-bars');
                }
            }

            // Défilement fluide vers l'ancre
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar animation au scroll
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(18, 18, 18, 1)';
            } else {
                navbar.style.background = 'rgba(18, 18, 18, 0.95)';
            }
        }
    });

    // Menu Hamburger
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (navIcon) {
                navIcon.classList.toggle('fa-bars');
                navIcon.classList.toggle('fa-times');
            }
        });
        
        // Fermer le menu après avoir cliqué sur un lien
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (navIcon) {
                    navIcon.classList.add('fa-bars');
                    navIcon.classList.remove('fa-times');
                }
            });
        });
    }

    // =========================================================
    // 03. GESTION POPUP PROJETS / FORMATIONS / HOBBIES & GALERIES
    // =========================================================

    if (projectModal && galleryModal) {
        
        // 3.1 Gestion de l'ouverture des cartes (Projet/Formation)
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                
                // Ignorer le clic si l'utilisateur clique sur un élément interactif à l'intérieur
                if (e.target.closest('a') || e.target.closest('button')) {
                    return;
                }
                
                // === 1. Vérification du Mode Galerie Statique (Photographie) ===
                const galleryPath = card.getAttribute('data-gallery-path');
                const galleryImages = card.getAttribute('data-gallery-images');

                if (galleryPath && galleryImages && galleryContainer) {
                    
                    // --- DESACTIVE LE MODE SLIDER (Mode Galerie Statique) ---
                    galleryContainer.classList.remove('slider-mode');

                    galleryContainer.innerHTML = ''; // Vide le conteneur
                    const imageNames = galleryImages.split(',');
                    let imageHTML = '';

                    // Crée les balises <img> pour chaque image (Défilement vertical)
                    imageNames.forEach(imageName => {
                        imageHTML += `<img src="${galleryPath}${imageName.trim()}" alt="Photographie" style="max-width: 100%; height: auto; margin-bottom: 20px;">`;
                    });

                    galleryContainer.innerHTML = imageHTML;
                    
                    // Masque les contrôles de carrousel (uniquement pour la vue statique)
                    if (prevBtn) prevBtn.style.display = 'none';
                    if (nextBtn) nextBtn.style.display = 'none';
                    if (imageCounter) imageCounter.style.display = 'none';
                    
                    galleryModal.style.display = 'flex';
                    return; // Stoppe ici pour ne pas ouvrir la modale standard
                }

                // === 2. Cas Modale de Projet Standard ===
                const title = card.querySelector('h3').innerText;
                const company = card.querySelector('.company').innerText;
                const tags = card.querySelector('.tags') ? card.querySelector('.tags').innerHTML : '';
                
                const hiddenDetails = card.querySelector('.hidden-details');
                let descriptionHTML = "";

                if (hiddenDetails) {
                    descriptionHTML = hiddenDetails.innerHTML;
                } else {
                    descriptionHTML = card.querySelector('p:not(.company)').innerHTML;
                }

                // Remplissage et affichage de la modale PROJECT-MODAL
                if (modalTitle && modalCompany && modalBody && modalTags) {
                    modalTitle.innerText = title;
                    modalCompany.innerText = company;
                    modalBody.innerHTML = descriptionHTML;
                    modalTags.innerHTML = tags;
                    projectModal.style.display = 'flex';
                }
            });
        });

        // 3.2 Gestion de l'ouverture Hobbies
        if (btnShowHobbies && hobbiesDetails) {
            btnShowHobbies.addEventListener('click', () => {
                modalTitle.innerText = "Mes Hobbies";
                modalCompany.innerText = "";
                modalBody.innerHTML = hobbiesDetails.innerHTML;
                modalTags.innerHTML = `
                    <span>Personnel</span>
                    <span>Détente</span>
                    <span>Sport</span>
                `;
                projectModal.style.display = 'flex';
            });
        }
        
        // 3.3 Fermeture de la Modale de Détails
        if (projectModalCloseBtn) {
            projectModalCloseBtn.addEventListener('click', () => {
                projectModal.style.display = 'none';
            });
        }

        // 3.4 Fermeture des Modales au clic extérieur (AJUSTÉ)
        window.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.style.display = 'none';
            }
            // Si c'est la modale galerie, on appelle la fonction de fermeture (qui réinitialise l'état)
            if (e.target === galleryModal) {
                 if (galleryCloseBtn) {
                    galleryCloseBtn.click();
                } else {
                    galleryModal.style.display = 'none';
                }
            }
        });
    }

    // =========================================================
    // 04. GESTION MODALE CARROUSEL (pour le bouton Modélisation 3D)
    // =========================================================
    if (galleryModal && carouselImage && prevBtn && nextBtn && galleryContainer) {
        
        // Fonction pour afficher l'image actuelle du carrousel
        const updateCarousel = () => {
            if (currentImages.length === 0) return;
            
            // Le chemin est déterminé au moment de l'ouverture pour gérer les différents dossiers
            carouselImage.src = currentPath + currentImages[currentIndex].trim(); 
            
            // Mise à jour du compteur
            imageCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        };
    
        // 4.1 Navigation (Précédent / Suivant)
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateCarousel();
        });
    
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateCarousel();
        });
    
        // 4.2 Gestion de l'ouverture de la galerie (Bouton dans la modale projet)
        document.addEventListener('click', (e) => {
            // Vérifie si on a cliqué sur le bouton de galerie pour la 3D
            const openGalleryBtn = e.target.closest('.open-gallery-btn');
            
            if (openGalleryBtn) {
                e.stopPropagation(); 
                
                // Fermer la modale de détails si elle est ouverte
                if (projectModal) {
                    projectModal.style.display = 'none'; 
                }

                // --- AJOUT IMPORTANT : ACTIVE LE MODE SLIDER ---
                if (galleryContainer) {
                    galleryContainer.classList.add('slider-mode'); // Ajoute la classe CSS spéciale
                    galleryContainer.scrollTop = 0; // Remet le scroll en haut
                }

                // Afficher les contrôles du carrousel pour la 3D
                // C'est ce qui rend les flèches visibles (combiné avec le CSS .slider-mode .nav-btn)
                if (prevBtn) prevBtn.style.display = 'block';
                if (nextBtn) nextBtn.style.display = 'block';
                if (imageCounter) imageCounter.style.display = 'block';

                // On récupère les données
                const imagesString = openGalleryBtn.getAttribute('data-images') || '';
                
                // CORRECTION DU CHEMIN : Ajout de 'projets/'
                currentPath = 'assets/images/projets/modelisation/'; 

                currentImages = imagesString ? imagesString.split(',') : [];
            
                if (currentImages.length > 0) {
                    currentIndex = 0;
                    
                    // On vide le conteneur puis on injecte le carrousel (cache les images statiques)
                    galleryContainer.innerHTML = '';
                    galleryContainer.appendChild(carouselImage); 
                    
                    // On s'assure que l'image du carrousel est visible
                    carouselImage.style.display = 'block';
                    
                    updateCarousel();
                    galleryModal.style.display = 'flex';
                }
            }
        });
        
        // 4.3 Gestion de la fermeture de la galerie (CORRIGÉ)
        if (galleryCloseBtn) {
            galleryCloseBtn.addEventListener('click', () => {
                galleryModal.style.display = 'none';

                // --- CORRECTION : Réinitialisation de l'état du carrousel après fermeture ---
                if (galleryContainer) {
                    galleryContainer.classList.remove('slider-mode'); // Désactive le mode carrousel (essentiel)
                }
                // Masque les flèches pour les futures ouvertures en mode Galerie Statique (Photographie)
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                // -----------------------------------------------------------------------------
            });
        }
    
        // 4.4 Navigation au clavier pour la Galerie
        document.addEventListener('keydown', (e) => {
            // Vérifie si la modale est visible ET si on est en mode carrousel (plus d'une image)
            if (galleryModal.style.display === 'flex' && currentImages.length > 1) { 
                if (e.key === 'ArrowLeft') {
                    prevBtn.click();
                } else if (e.key === 'ArrowRight') {
                    nextBtn.click();
                } 
            }
            if (galleryModal.style.display === 'flex' && e.key === 'Escape') {
                 galleryCloseBtn.click();
            }
        });
    }

    // Gestion de la fermeture de la modale de Détails avec Echap
    document.addEventListener('keydown', (e) => {
        if (projectModal && projectModal.style.display === 'flex' && e.key === 'Escape') {
            projectModalCloseBtn.click();
        }
    });


    
});