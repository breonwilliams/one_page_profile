// Toggle skills visibility
function toggleSkills() {
    const hiddenSkills = document.querySelectorAll('.profile-tag.hidden-skill');
    const addButton = document.querySelector('.profile-tag.add-tag');
    
    hiddenSkills.forEach(skill => {
        skill.classList.toggle('show');
    });
    
    addButton.classList.toggle('expanded');
    addButton.setAttribute('aria-label', 
        addButton.classList.contains('expanded') ? 'Hide skills' : 'Show more skills'
    );
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners
    const skillToggle = document.querySelector('.profile-tag.add-tag');
    if (skillToggle) {
        skillToggle.addEventListener('click', toggleSkills);
    }
});