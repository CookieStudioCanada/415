document.addEventListener('DOMContentLoaded', () => {
    console.log('Global script loaded.');
    const authLink = document.getElementById('auth-link');
    const profileLink = document.getElementById('profile-link');
    const moduleCards = document.querySelectorAll('.module-card'); 
    const heroSection = document.querySelector('section.hero'); // For index.html
    const loggedInContent = document.querySelector('section.logged-in-content'); // For index.html

    // --- Simulate Auth & Subscription State --- 
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isSubscribed = localStorage.getItem('isSubscribed') === 'true';
    console.log('Simulated State:', { isLoggedIn, isSubscribed });

    // Initial UI update based on state
    updateNavbar(isLoggedIn);
    updatePageContent(isLoggedIn);

    // --- Event Listeners --- 

    // Handle Login/Logout link click
    if (authLink) {
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) {
                console.log('Logout action triggered.');
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('isSubscribed'); 
                alert('Déconnexion réussie.'); 
                console.log('Redirecting to index.html after logout.');
                window.location.href = 'index.html'; // Redirect to landing page
            } else {
                console.log('Login link clicked, redirecting to login.html');
                window.location.href = 'login.html'; 
            }
        });
    }

    // Handle module card clicks (Relevant on app.html)
    if (moduleCards.length > 0) {
        console.log(`Found ${moduleCards.length} module cards. Attaching listeners.`);
        moduleCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                console.log(`-- Click detected on card index ${index} --`);
                const moduleId = card.getAttribute('data-module-id'); 
                const targetUrl = `video.html?module=${moduleId}`;
                console.log(`Card click: ID=${moduleId}, Target=${targetUrl}, Current State:`, { isLoggedIn, isSubscribed });
    
                if (!isLoggedIn) { // Should ideally not happen if they are on app.html, but good failsafe
                    console.log('Condition: !isLoggedIn is TRUE');
                    alert('Veuillez vous connecter pour accéder aux modules.');
                    const redirectUrl = `login.html?redirect=${encodeURIComponent(targetUrl)}`;
                    console.log('Redirecting to login:', redirectUrl);
                     window.location.href = redirectUrl; 
                } else if (!isSubscribed) {
                     console.log('Condition: !isSubscribed is TRUE (and isLoggedIn is TRUE)');
                    alert('Veuillez vous abonner pour accéder à ce module.');
                    const redirectUrl = `subscribe.html?redirect=${encodeURIComponent(targetUrl)}`;
                     console.log('Redirecting to subscribe:', redirectUrl);
                     window.location.href = redirectUrl;
                } else {
                    console.log('Condition: isLoggedIn AND isSubscribed are TRUE');
                    console.log('Redirecting to module page:', targetUrl);
                    window.location.href = targetUrl;
                }
                console.log(`-- Click handler finished for card index ${index} --`);
            });
        });
    } else {
         console.log('No module cards found on this page.');
    }

    // --- Helper Functions --- 

    function updateNavbar(loggedIn) {
         if (!authLink || !profileLink) {
             console.error('Auth or Profile link not found in Navbar');
             return;
         } 
        const profileNavItem = profileLink.closest('.nav-item');
        // console.log('Profile Nav Item Element:', profileNavItem);

        if (loggedIn) {
            // console.log('Updating Navbar for LOGGED IN state');
            authLink.textContent = 'Déconnexion';
            authLink.href = '#'; 
            if(profileNavItem) profileNavItem.classList.remove('d-none');
            profileLink.setAttribute('data-bs-toggle', 'modal');
            profileLink.setAttribute('data-bs-target', '#profileModal');
        } else {
            // console.log('Updating Navbar for LOGGED OUT state');
            authLink.textContent = 'Connexion / Inscription';
            authLink.href = 'login.html'; 
            if(profileNavItem) profileNavItem.classList.add('d-none');
            profileLink.removeAttribute('data-bs-toggle');
            profileLink.removeAttribute('data-bs-target');
        }
    }

    function updatePageContent(loggedIn) {
        // Only applies to index.html elements
        if (heroSection) {
            if(loggedIn) {
                heroSection.classList.add('d-none');
                console.log('Hero section hidden');
            } else {
                heroSection.classList.remove('d-none');
                 console.log('Hero section shown');
            }
        }
        if (loggedInContent) {
             if(loggedIn) {
                loggedInContent.classList.remove('d-none');
                console.log('Logged-in content shown');
            } else {
                loggedInContent.classList.add('d-none');
                 console.log('Logged-in content hidden');
            }
        }
    }

    // --- Modal Specific Logic (remains the same) --- 
    const profileModalElement = document.getElementById('profileModal');
    const logoutFromModalButton = document.getElementById('logout-from-modal');

    if (profileModalElement) {
        profileModalElement.addEventListener('show.bs.modal', event => {
            console.log('Profile modal is being shown.');
            const subStatusSpan = document.getElementById('modal-subscription-status');
            const isSubscribed = localStorage.getItem('isSubscribed') === 'true';
            if (subStatusSpan) {
                subStatusSpan.textContent = isSubscribed ? 'Actif' : 'Inactif';
                subStatusSpan.className = isSubscribed ? 'text-success fw-bold' : 'text-danger';
            }
        });
    }
    if (logoutFromModalButton) {
        logoutFromModalButton.addEventListener('click', () => {
            console.log('Logout triggered from modal.');
            const modalInstance = bootstrap.Modal.getInstance(profileModalElement);
            if(modalInstance) modalInstance.hide();
            if (authLink) authLink.click(); 
        });
    }

}); 