document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 01. SÉLECTEURS GLOBAUX
    // =========================================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navIcon = hamburger ? hamburger.querySelector('i') : null;

    // Modale de Détails (Projets/Formations/Hobbies)
    const projectModal = document.getElementById('project-modal');
    const projectCards = document.querySelectorAll('.project-card, .formation-card');
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

    // Sélecteurs de la Modale Galerie (Carrousel)
    const galleryModal = document.getElementById('gallery-modal');
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

    // Variables pour le Carrousel
    let currentImages = [];
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
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                // NOTE: J'ai retiré le changement de couleur de bordure ici, car elle est définie en CSS pour la transparence
                navbar.style.background = 'rgba(18, 18, 18, 1)';
            } else {
                navbar.style.background = 'rgba(18, 18, 18, 0.95)';
            }
        }
    });

    // Menu Hamburger
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            // Pas besoin de vérifier le style.display, le CSS gère l'affichage/masquage
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
    // 03. GESTION POPUP PROJETS / FORMATIONS / HOBBIES
    // =========================================================

    if (projectModal) {
        
        // 3.1 Gestion de l'ouverture des cartes (Projet/Formation)
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                
                // Ignorer le clic si l'utilisateur clique sur un bouton interactif
                // On inclut ici l'ID du bouton galerie pour éviter le conflit sur le parent
                if (e.target.closest('.download-btn') || e.target.closest('#open-gallery-scifi')) {
                    return;
                }

                // Extraction des données de la carte
                const title = card.querySelector('h3').innerText;
                const company = card.querySelector('.company').innerText;
                const tags = card.querySelector('.tags').innerHTML;
                
                const hiddenDetails = card.querySelector('.hidden-details');
                let descriptionHTML = "";

                if (hiddenDetails) {
                    descriptionHTML = hiddenDetails.innerHTML;
                } else {
                    descriptionHTML = card.querySelector('p:not(.company)').innerHTML;
                }

                // Remplissage et affichage de la modale
                modalTitle.innerText = title;
                modalCompany.innerText = company;
                modalBody.innerHTML = descriptionHTML;
                modalTags.innerHTML = tags;

                projectModal.style.display = 'flex';
            });
        });

        // 3.2 Gestion de l'ouverture Hobbies
        if (btnShowHobbies && hobbiesDetails) {
            btnShowHobbies.addEventListener('click', () => {
                modalTitle.innerText = "Mes Hobbies";
                modalCompany.innerText = ""; // Vider le champ "entreprise"
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

        // Fermeture en cliquant en dehors de la fenêtre
        window.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.style.display = 'none';
            }
        });
    }

    // =========================================================
    // 04. GESTION MODALE GALERIE (CARROUSEL)
    // =========================================================
    if (galleryModal) {
        
        // Fonction pour afficher l'image actuelle du carrousel
        function updateCarousel() {
            if (currentImages.length === 0) return;
            
            // Correction du chemin d'accès (modelisation)
            carouselImage.src = 'assets/images/modelisation/' + currentImages[currentIndex]; 
            
            // Mise à jour du compteur
            imageCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        }
    
        // 4.1 Navigation (Précédent / Suivant)
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateCarousel();
        });
    
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateCarousel();
        });
    
        // 4.2 Gestion de l'ouverture de la galerie (CORRIGÉ)
        document.addEventListener('click', (e) => {
            // On vérifie si on a cliqué sur le bouton (ou l'icône à l'intérieur)
            const openGalleryBtn = e.target.closest('.open-gallery-btn');
            
            if (openGalleryBtn) {
                // Empêche le clic de remonter (évite de ré-ouvrir la modale projet)
                e.stopPropagation(); 
                
                // Si la modale de détails est ouverte, on la ferme pour laisser place à la galerie
                if (projectModal) {
                    projectModal.style.display = 'none'; 
                }

                // CORRECTION MAJEURE ICI :
                // On récupère la liste des images directement sur le bouton cliqué
                const imagesString = openGalleryBtn.getAttribute('data-images') || '';
                
                // On transforme la chaîne de caractères en tableau (séparé par des virgules)
                currentImages = imagesString ? imagesString.split(',') : [];
    
                // Vérification console pour être sûr
                console.log("Images chargées :", currentImages);
    
                if (currentImages.length > 0) {
                    // Remettre le carrousel à zéro (première image)
                    currentIndex = 0;
                    updateCarousel();
                    
                    // Ouvrir la modale galerie
                    galleryModal.style.display = 'flex';
                } else {
                    console.error("Erreur : Aucune image trouvée dans l'attribut data-images du bouton.");
                }
            }
        });
        
        // 4.3 Gestion de la fermeture de la galerie
        galleryCloseBtn.addEventListener('click', () => {
            galleryModal.style.display = 'none';
        });
        
        // Fermeture en cliquant en dehors de la modale galerie
        window.addEventListener('click', (event) => {
            if (event.target === galleryModal) {
                galleryModal.style.display = 'none';
            }
        });

        // 4.4 Navigation au clavier pour la Galerie
        document.addEventListener('keydown', (e) => {
            if (galleryModal.style.display === 'flex') {
                if (e.key === 'ArrowLeft') {
                    prevBtn.click();
                } else if (e.key === 'ArrowRight') {
                    nextBtn.click();
                } else if (e.key === 'Escape') {
                    galleryCloseBtn.click();
                }
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