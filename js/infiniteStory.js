document.addEventListener('wheel', function(e) {
  if (document.body.classList.contains("no-scroll")) {
    e.preventDefault()
  }
  const storyContainer = document.getElementById('recipe-body');
  if (storyContainer.getBoundingClientRect().bottom<= window.innerHeight - 50) {
      debouncedFetch();
  } else {
    // Determine the direction of the scroll (+ve is down, -ve is up)
    const delta = e.deltaY > 0 ? 1 : -1;

    // Scroll the page by a fraction of the delta (in this case, 30%)
    window.scrollBy(0, delta * 0.8);
  }
  // Prevent the default behavior to effectively replace it with our custom scrolling
  e.preventDefault();
}, { passive: false });

let startY = 0;

document.addEventListener('touchstart', function(e) {
    startY = e.touches[0].pageY;
}, false);

document.addEventListener('touchmove', function(e) {
    if (document.body.classList.contains("no-scroll")) {
      e.preventDefault()
    }
    const storyContainer = document.getElementById('recipe-body');
    if (storyContainer.getBoundingClientRect().bottom <= window.innerHeight - 50) {
        debouncedFetch();
    } else {
      // Calculate the distance moved
      const deltaY = e.touches[0].pageY - startY;

      // Slow down the scroll (in this case, we'll move by half of the touch distance)
      window.scrollBy(0, deltaY * -0.7);

      // Update startY for the next move
      startY = e.touches[0].pageY;
    }
    // Prevent default to stop native scroll
    e.preventDefault();
}, { passive: false });


document.addEventListener("DOMContentLoaded", function() {
    const storyContainer = document.getElementById('recipe-body');
    const API_ENDPOINT = 'https://storied-recipes-backend.azurewebsites.net/api/generate_story';
    // const API_ENDPOINT = 'http://127.0.0.1:7071/api/generate_story';
    let lastSentences = storyContainer.innerText.split(' ').slice(-50).join(' ');

    async function fetchAndAppendStory() {
        document.body.classList.add('no-scroll');  // Disable scrolling before the API call
        console.log("Need more story!")
        while (storyContainer.getBoundingClientRect().bottom <= window.innerHeight - 50) {
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
              console.error('Error fetching the next story piece:', err.message);
          }
        }
        console.log("Got the story");
        document.body.classList.remove('no-scroll');  // Re-enable scrolling after appending the story
    }

    const debouncedFetch = debounce(fetchAndAppendStory, 100);

    function onScroll() {
        const containerBottom = storyContainer.getBoundingClientRect().bottom;
        if (containerBottom <= window.innerHeight - 50) {
            debouncedFetch();
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
    window.onscroll = onScroll;
});

