function filterRecipes() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    console.log("Search for:", input); // placeholder for search logic
    // In the future, we’ll filter recipes by location, holiday, etc.
}

function goToMap() {
    alert("Map feature coming soon! 🌍");
}


// Listen for the recipe form submission
document.getElementById('recipeForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const story = document.getElementById('familyStory').value;
    const ingredients = document.getElementById('ingredients').value.split('\n');
    const instructions = document.getElementById('instructions').value;
    const imageFile = document.getElementById('image').files[0];
    const region = document.getElementById('region').value;
    const kashrut = document.getElementById('kashrut').value;
    const holiday = document.getElementById('holiday').value;
    const author = document.getElementById('authorName').value;

    const reader = new FileReader();

    reader.onload = function (event) {
        const imageHTML = imageFile ? `<img src="${event.target.result}" alt="Recipe Image">` : '';

        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';

        recipeCard.innerHTML = `
            <h3>${title}</h3>
            ${imageHTML}
            <p><strong>🌍 Region:</strong> ${region} | <strong>🧀 Kosher Type:</strong> ${kashrut} | <strong>🕯️ Holiday:</strong> ${holiday}</p>
            <h4>📝 Family Story</h4>
            <p>${story}</p>
            <h4>🧂 Ingredients</h4>
            <ul>${ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
            <h4>🍳 Instructions</h4>
            <p>${instructions}</p>
            <p><em>Posted by: ${author}</em></p>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        document.getElementById('recipeList').appendChild(recipeCard);

        // Save to localStorage
        let recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        recipes.push({
            title, story, ingredients, instructions,
            image: event.target.result,
            region, kashrut, holiday, author
        });
        localStorage.setItem('recipes', JSON.stringify(recipes));

        // Reset the form
        document.getElementById('recipeForm').reset();

        // Set up edit/delete
        recipeCard.querySelector('.delete-btn').addEventListener('click', () => recipeCard.remove());

        recipeCard.querySelector('.edit-btn').addEventListener('click', () => {
            document.getElementById('title').value = title;
            document.getElementById('familyStory').value = story;
            document.getElementById('ingredients').value = ingredients.join('\n');
            document.getElementById('instructions').value = instructions;
            document.getElementById('region').value = region;
            document.getElementById('kashrut').value = kashrut;
            document.getElementById('holiday').value = holiday;
            document.getElementById('authorName').value = author;
            recipeCard.remove();
        });
    };

    if (imageFile) {
        reader.readAsDataURL(imageFile);
    } else {
        reader.onload({ target: { result: '' } });
    }
});



function filterRecipes() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const allRecipes = document.querySelectorAll('.recipe-card');

    allRecipes.forEach(card => {
        const title = card.querySelector('h3')?.innerText.toLowerCase() || "";
        if (title.includes(searchValue)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}


document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    }
});

const searchInput = document.getElementById('searchInput');
const filterDropdown = document.getElementById('filterDropdown');

searchInput.addEventListener('focus', () => {
  filterDropdown.classList.remove('hidden');
});

document.addEventListener('click', (e) => {
  if (!document.getElementById('searchContainer').contains(e.target)) {
    filterDropdown.classList.add('hidden');
  }
});

document.getElementById('filterForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const region = document.getElementById('filterRegion').value;
    const kashrut = document.getElementById('filterKashrut').value;
    const holiday = document.getElementById('filterHoliday').value;

    const queryParams = new URLSearchParams();

    if (region) queryParams.append('region', region);
    if (kashrut) queryParams.append('kashrut', kashrut);
    if (holiday) queryParams.append('holiday', holiday);

    window.location.href = `filter.html?${queryParams.toString()}`;
});

// 🌍 Initialize Leaflet Map
const map = L.map('leafletMap').setView([20, 0], 2); // center of the world

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 📌 Region Pins
const regions = [
  { name: "Asia", coords: [34, 100] },
  { name: "Europe", coords: [48, 10] },
  { name: "North America", coords: [40, -100] },
  { name: "South America", coords: [-15, -60] },
  { name: "Middle East", coords: [31, 35] },
  { name: "Africa", coords: [0, 20] }
];

regions.forEach(region => {
  const marker = L.marker(region.coords).addTo(map);
  marker.bindPopup(`<b>${region.name}</b><br><a href="filter.html?region=${encodeURIComponent(region.name)}">See Recipes</a>`);
});
