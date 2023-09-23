document.addEventListener("DOMContentLoaded", function() {
    const storyContainer = document.getElementById('recipe-body');
    const API_ENDPOINT = 'https://storied-recipes.netlify.app/.netlify/functions/generate-story';
    let lastSentences = storyContainer.innerText.split(' ').slice(-50).join(' ');

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
            const newStoryPiece = data.story.trim();

            storyContainer.innerHTML += newStoryPiece;
            lastSentences = newStoryPiece.split(' ').slice(-50).join(' ');

        } catch (err) {
            console.error('Error fetching the next story piece:', err);
        }
    }

    function onScroll() {
        const containerBottom = storyContainer.getBoundingClientRect().bottom;

        if (containerBottom <= window.innerHeight + 300) {
	    document.body.classList.add('no-scroll');  // Disable scrolling before the API call
            fetchAndAppendStory();
            document.body.classList.remove('no-scroll');  // Re-enable scrolling after appending the story
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
    window.onscroll = debounce(onScroll, 250);
});

