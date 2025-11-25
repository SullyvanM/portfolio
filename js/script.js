document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 01. SÉLECTEURS GLOBAUX
    // =========================================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navIcon = hamburger ? hamburger.querySelector('i') : null; // Ajout d'une vérification pour hamburger

    // Sélecteurs de la modale (NOTE : ON N'UTILISE QUE PROJECT-MODAL)
    const modal = document.getElementById('project-modal');
    
    // Si la modale existe, on sélectionne ses enfants
    let closeBtn = null;
    let modalTitle = null;
    let modalCompany = null;
    let modalBody = null;
    let modalTags = null;

    if (modal) {
        closeBtn = modal.querySelector('.close-btn');
        modalTitle = document.getElementById('modal-title');
        modalCompany = document.getElementById('modal-company');
        modalBody = document.getElementById('modal-body');
        modalTags = document.getElementById('modal-tags');
    }

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
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Navbar animation au scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(18, 18, 18, 1)';
                navbar.style.borderBottom = '1px solid var(--accent)';
            } else {
                navbar.style.background = 'rgba(18, 18, 18, 0.95)';
                navbar.style.borderBottom = '1px solid #333';
            }
        }
    });

    // Menu Hamburger (actif uniquement sur mobile via CSS Media Query)
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const style = window.getComputedStyle(hamburger);
            
            if (style.display !== 'none') {
                navLinks.classList.toggle('active');
                if (navIcon) {
                    navIcon.classList.toggle('fa-bars');
                    navIcon.classList.toggle('fa-times');
                }
            }
        });
    }

    // Fermer le menu après avoir cliqué sur un lien
    if (navLinks) {
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
    // 03. GESTION POPUP PROJETS & FORMATIONS (Activé UNIQUEMENT si la modale existe)
    // =========================================================

    const cards = document.querySelectorAll('.formation-card, .project-card');

    if (modal && modalTitle && modalCompany && modalBody && modalTags) {
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                
                // Ignorer le clic si l'utilisateur clique sur le bouton de téléchargement
                if (e.target.closest('.download-btn')) {
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
                    // Si pas de hidden-details, on prend la courte description
                    descriptionHTML = card.querySelector('p:not(.company)').innerHTML;
                }

                // Remplissage et affichage de la modale
                modalTitle.innerText = title;
                modalCompany.innerText = company; // Renseigné pour projets/formations
                modalBody.innerHTML = descriptionHTML;
                modalTags.innerHTML = tags;

                modal.style.display = 'flex';
            });
        });

        // Fermeture avec la croix
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Fermeture en cliquant en dehors de la fenêtre
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    } // Fin de la vérification 'if (modal)'
    
    // =========================================================
    // 04. GESTION DE LA MODALE HOBBIES
    // =========================================================
    
    const btnShowHobbies = document.getElementById('btn-show-hobbies');
    const hobbiesDetails = document.getElementById('hobbies-details');

    if (btnShowHobbies && hobbiesDetails && modal && modalTitle && modalCompany && modalBody) {
        btnShowHobbies.addEventListener('click', () => {
            
            modalTitle.innerText = "Mes Hobbies";

            // Vider champ "entreprise" pour les hobbies
            modalCompany.innerText = "";
            
            modalBody.innerHTML = hobbiesDetails.innerHTML;
            
            // Tags hobbies
            modalTags.innerHTML = `
                <span>Personnel</span>
                <span>Détente</span>
                <span>Sport</span>
            `;

            modal.style.display = 'flex';
        });
    }
});