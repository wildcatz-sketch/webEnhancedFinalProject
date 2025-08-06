// Characters page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
    initCharactersPage();
});

function initCharactersPage() {
    // Category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    const characterCards = document.querySelectorAll('.character-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            filterCharacters(category);
        });
    });
    
    // Character card hover effects
    characterCards.forEach(card => {
        setupCharacterHover(card);
    });
}

function filterCharacters(category) {
    const characterCards = document.querySelectorAll('.character-card');
    
    characterCards.forEach(card => {
        const cardCategories = card.dataset.category.split(' ');
        
        if (category === 'all' || cardCategories.includes(category)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            card.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

function setupCharacterHover(card) {
    let isHovering = false;
    
    card.addEventListener('mouseenter', () => {
        isHovering = true;
        startCharacterHover(card);
    });
    
    card.addEventListener('mouseleave', () => {
        isHovering = false;
        endCharacterHover(card);
    });
    
    card.addEventListener('mousemove', (e) => {
        if (isHovering) {
            updateCharacterTilt(card, e);
        }
    });
}

function startCharacterHover(card) {
    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
    
    // Add special effects for certain characters
    const characterName = card.querySelector('.character-name').textContent;
    if (characterName.includes('Naruto')) {
        card.style.filter = 'drop-shadow(0 0 20px var(--primary-color))';
    } else if (characterName.includes('Sasuke')) {
        card.style.filter = 'drop-shadow(0 0 20px var(--dark-blue))';
    }
}

function endCharacterHover(card) {
    card.style.transform = 'translateY(0px) rotateY(0deg)';
    card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    card.style.filter = 'none';
}

function updateCharacterTilt(card, event) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

// Add floating animation to technique tags
document.querySelectorAll('.technique-tag').forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.1}s`;
    tag.classList.add('hover-float');
});

// Add click event to character cards for future modal functionality
document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('click', () => {
        const characterName = card.querySelector('.character-name').textContent;
        showCharacterInfo(characterName);
    });
});

function showCharacterInfo(characterName) {
    // This would open a modal with detailed character information
    // For now, just show an alert
    alert(`Learn more about ${characterName}\n\nIn a full implementation, this would open a detailed character profile modal with biography, abilities, and memorable quotes.`);
}
