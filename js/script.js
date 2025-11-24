document.addEventListener('DOMContentLoaded', () => {
    
    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Navbar Animation ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(18, 18, 18, 1)';
            navbar.style.borderBottom = '1px solid var(--accent)';
        } else {
            navbar.style.background = 'rgba(18, 18, 18, 0.95)';
            navbar.style.borderBottom = '1px solid #333';
        }
    });

    // --- GESTION DE LA MODALE (POPUP) ---
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-btn');
    
    // On sélectionne toutes les cartes qui doivent être cliquables
    const cards = document.querySelectorAll('.formation-card, .project-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // 1. Récupérer les infos visibles de la carte
            const title = card.querySelector('h3').innerText;
            const company = card.querySelector('.company').innerText;
            const tags = card.querySelector('.tags').innerHTML;
            
            // 2. Récupérer les détails cachés (ou le texte par défaut si pas de détails)
            const hiddenDetails = card.querySelector('.hidden-details');
            let descriptionHTML = "";

            if (hiddenDetails) {
                descriptionHTML = hiddenDetails.innerHTML;
            } else {
                // Fallback: on prend le petit paragraphe visible
                descriptionHTML = card.querySelector('p:not(.company)').innerHTML;
            }

            // 3. Remplir la modale
            document.getElementById('modal-title').innerText = title;
            document.getElementById('modal-company').innerText = company;
            document.getElementById('modal-body').innerHTML = descriptionHTML;
            document.getElementById('modal-tags').innerHTML = tags;

            // 4. Afficher la modale
            modal.style.display = 'flex';
        });
    });

    // Fermer avec la croix
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fermer en cliquant en dehors de la fenêtre
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
<<<<<<< Updated upstream
=======

    // =========================================================
    // 04. NOUVEAU : GESTION DE LA MODALE HOBBIES
    // =========================================================
    
    const btnShowHobbies = document.getElementById('btn-show-hobbies');
    const hobbiesDetails = document.getElementById('hobbies-details');

    if (btnShowHobbies && hobbiesDetails) {
        btnShowHobbies.addEventListener('click', () => {
            
            // Remplir la modale avec le contenu de #hobbies-details
            document.getElementById('modal-title').innerText = "Mes Hobbies et Compétences Douces (Soft Skills)";
            document.getElementById('modal-company').innerText = "Découvrez ma personnalité et les qualités que ces activités développent.";
            document.getElementById('modal-body').innerHTML = hobbiesDetails.innerHTML;
            
            // Tags spécifiques pour les hobbies
            document.getElementById('modal-tags').innerHTML = "<span>Photographie</span><span>Jeux Vidéo</span><span>Kendo</span>";

            // Afficher la modale
            modal.style.display = 'flex';
        });
    }
>>>>>>> Stashed changes
});