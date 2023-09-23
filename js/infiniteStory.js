document.addEventListener("DOMContentLoaded", function() {
    const storyContainer = document.getElementById('recipe-body');
    const API_ENDPOINT = 'https://storied-recipes.netlify.app/functions/generate-story';
    let lastSentences = '';

    async function fetchAndAppendStory() {
        try {
            const recipeName = document.title;
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipe_name: recipeName, last_sentences: lastSentences })
            });

            const data = await response.json();
            const newStoryPiece = data.choices[0].text.trim();

            storyContainer.innerHTML += newStoryPiece;
            lastSentences = newStoryPiece.split(' ').slice(-50).join(' ');

        } catch (err) {
            console.error('Error fetching the next story piece:', err);
        }
    }

    function onScroll() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
            fetchAndAppendStory();
        }
    }

    function debounce(func, wait) {
        let timeout;

        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Using the debounce function to limit how often onScroll can be called
    window.onscroll = debounce(onScroll, 250);  // Waits 250ms after the last scroll event before executing the function
});

