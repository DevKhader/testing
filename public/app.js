document.addEventListener('DOMContentLoaded', function () {
    const moviesContainer = document.getElementById('movies-container');
    const searchBar = document.getElementById('searchBar');
    const trailerModal = document.getElementById('trailer-modal');
    const closeModal = document.querySelector('.close');

    // Fetch and display movies
    async function loadMovies() {
        const response = await fetch('/movies');
        const movies = await response.json();

        moviesContainer.innerHTML = ''; // Clear the container

        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="${movie.posterUrl}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p class="description">${movie.description.slice(0, 150)}...</p>  <!-- First 150 characters -->
                <p class="description-full" style="display: none;">${movie.description}</p>  <!-- Full description -->
                <button class="more-btn">More</button>
                <div class="rating-stars">Rating: ${movie.rating} / 5</div>
                <button class="view-trailer" data-trailer="${movie.trailerUrl}">Watch Trailer</button>
            `;
            moviesContainer.appendChild(movieCard);

            const moreBtn = movieCard.querySelector('.more-btn');
            const descriptionFull = movieCard.querySelector('.description-full');
            const description = movieCard.querySelector('.description');

            // Add event listener to the "More" button
            moreBtn.addEventListener('click', () => {
                if (descriptionFull.style.display === 'none') {
                    descriptionFull.style.display = 'block';  // Show the full description
                    description.style.display = 'none';  // Hide the truncated description
                    moreBtn.textContent = 'Less';  // Change the button text to "Less"
                } else {
                    descriptionFull.style.display = 'none';  // Hide the full description
                    description.style.display = 'block';  // Show the truncated description
                    moreBtn.textContent = 'More';  // Reset the button text to "More"
                }
            });
        });

        // Add event listeners to trailer buttons
        document.querySelectorAll('.view-trailer').forEach(button => {
            button.addEventListener('click', function () {
                const trailerUrl = this.getAttribute('data-trailer');

                // Convert the YouTube URL to an embed URL
                const embedUrl = trailerUrl.replace('watch?v=', 'embed/');
                const iframeHtml = `
                    <iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
                `;

                // Display the iframe in the modal
                trailerModal.querySelector('.modal-content').innerHTML = iframeHtml;
                trailerModal.style.display = 'block';
            });
        });
    }

    loadMovies(); // Initial load

    // Search functionality
    searchBar.addEventListener('input', function () {
        const searchTerm = searchBar.value.toLowerCase();
        const movieCards = document.querySelectorAll('.movie-card');

        movieCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Close trailer modal (with the "X" button)
    closeModal.addEventListener('click', function () {
        trailerModal.style.display = 'none';
        trailerModal.querySelector('.modal-content').innerHTML = ''; // Clear iframe content
    });

    // Close modal when clicking outside of the video (optional)
    window.addEventListener('click', function (event) {
        if (event.target == trailerModal) {
            trailerModal.style.display = 'none';
            trailerModal.querySelector('.modal-content').innerHTML = ''; // Clear iframe content
        }
    });
});
