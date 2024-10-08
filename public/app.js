document.addEventListener('DOMContentLoaded', function() {
    const moviesContainer = document.getElementById('movies-container');
    const searchBar = document.getElementById('searchBar');
    const trailerModal = document.getElementById('trailer-modal');
    const trailerVideo = document.getElementById('trailer-video');
    const closeModal = document.querySelector('.close');

    // Fetch movies from the server
    async function loadMovies() {
        const response = await fetch('/movies'); // Get movies from the backend
        const movies = await response.json();

        moviesContainer.innerHTML = ''; // Clear the container

        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="${movie.posterUrl}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.description}</p>
                <div class="rating-stars">Rating: ${movie.rating} / 5</div>
                <button class="view-trailer" data-trailer="${movie.trailerUrl}">Watch Trailer</button>
            `;
            moviesContainer.appendChild(movieCard);
        });

        // Add event listeners to trailer buttons
        document.querySelectorAll('.view-trailer').forEach(button => {
            button.addEventListener('click', function() {
                const trailerUrl = this.getAttribute('data-trailer');
                trailerVideo.src = trailerUrl;
                trailerModal.style.display = 'block';
            });
        });
    }

    loadMovies(); // Initial load

    // Search functionality
    searchBar.addEventListener('input', function() {
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

    // Close trailer modal
    closeModal.addEventListener('click', function() {
        trailerModal.style.display = 'none';
        trailerVideo.src = ''; // Stop the video
    });
});
