const jewishHolidays2025 = [
    { name: "Purim", date: "2025-03-14" },
    { name: "Pesach", date: "2025-04-12" },
    { name: "Shavuot", date: "2025-06-01" },
    { name: "Rosh Hashanah", date: "2025-10-02" },
    { name: "Yom Kippur", date: "2025-10-11" },
    { name: "Sukkot", date: "2025-10-16" },
    { name: "Chanukah", date: "2025-12-21" }
  ];
  function getNextHoliday() {
    const today = new Date();
  
    for (const holiday of jewishHolidays2025) {
      const holidayDate = new Date(holiday.date);
      if (holidayDate >= today) {
        return holiday.name;
      }
    }
  
    return null; // no holidays left
  }
  function showHolidayPrep() {
    const holidayName = getNextHoliday();
    const container = document.getElementById("holiday-recipes");
    container.innerHTML = "";
  
    if (!holidayName) {
      container.innerHTML = "<p>No upcoming holidays!</p>";
      return;
    }
  
    const allRecipes = JSON.parse(localStorage.getItem("recipes") || "[]");
  
    // Filter recipes for this holiday
    const holidayRecipes = allRecipes
      .map(recipe => {
        const rating = parseInt(localStorage.getItem(`rating-${recipe.title}`)) || 0;
        return { ...recipe, rating };
      })
      .filter(recipe => recipe.holiday === holidayName);
  
    if (holidayRecipes.length === 0) {
      container.innerHTML = `<p>No recipes yet for ${holidayName}. Add one!</p>`;
      return;
    }
  
    // Sort by rating
    holidayRecipes.sort((a, b) => b.rating - a.rating);
    const top = holidayRecipes[0];
  
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <h3>
        <a href="recipe.html?title=${encodeURIComponent(top.title)}" class="recipe-link">
          ${top.title}
        </a>
        <span class="rating">${'★'.repeat(top.rating)}${'☆'.repeat(5 - top.rating)}</span>
      </h3>
      ${top.image ? `<img src="${top.image}" alt="Recipe Image">` : ""}
      <p><strong>🌍 Region:</strong> ${top.region} | <strong>🧀 Kosher Type:</strong> ${top.kashrut}</p>
      <h4>📝 Family Story</h4>
      <p>${top.story}</p>
    `;
  
    container.innerHTML = `<h3>🌟 Top Recipe for ${holidayName}</h3>`;
    container.appendChild(card);
  }
      


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
        <h3>
          ${title}
          <span class="rating" data-title="${title}">
            <span class="star" data-value="1">☆</span>
            <span class="star" data-value="2">☆</span>
            <span class="star" data-value="3">☆</span>
            <span class="star" data-value="4">☆</span>
            <span class="star" data-value="5">☆</span>
          </span>
        </h3>
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
        <button class="save-btn">Save</button>
      `;
      

        document.getElementById('recipeList').appendChild(recipeCard);
        // Set up the save button functionality
const saveBtn = recipeCard.querySelector('.save-btn');
saveBtn.addEventListener('click', () => {
  // Retrieve the saved recipes from localStorage (or initialize an empty array)
  let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');

  // Check if this recipe is already saved (we'll use title as a unique key)
  if (!savedRecipes.some(r => r.title === title)) {
    // Create an object for the recipe
    const recipeObj = {
      title, story, ingredients, instructions,
      image: imageFile ? imageHTML.match(/src="([^"]+)"/)?.[1] : "",
      region, kashrut, holiday, author
    };

    // Add it to the savedRecipes array and save it back to localStorage
    savedRecipes.push(recipeObj);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    alert('Recipe saved!');
  } else {
    alert('This recipe is already saved.');
  }
});
        // ⭐ Enable star rating
const ratingEl = recipeCard.querySelector('.rating');
if (ratingEl) {
  const recipeKey = ratingEl.dataset.title;
  const savedRating = localStorage.getItem(`rating-${recipeKey}`);

  const stars = ratingEl.querySelectorAll('.star');
  stars.forEach(star => {
    const starValue = parseInt(star.dataset.value);

    // Fill in saved stars
    if (savedRating && starValue <= savedRating) {
      star.textContent = '★';
    }

    // On click: update the rating
    star.addEventListener('click', () => {
      localStorage.setItem(`rating-${recipeKey}`, starValue);

      stars.forEach(s => {
        s.textContent = parseInt(s.dataset.value) <= starValue ? '★' : '☆';
      });
    });
  });
}


        // Save to localStorage
        let recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        recipes.push({
            title, story, ingredients, instructions,
            image: event.target.result,
            region, kashrut, holiday, author
        });
        localStorage.setItem('recipes', JSON.stringify(recipes));
        showTrendingRecipe();


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

function showTrendingRecipe() {
    const allRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    const trendingContainer = document.getElementById('trending-recipes');
    trendingContainer.innerHTML = ''; // Clear old trending card
  
    if (allRecipes.length === 0) {
      trendingContainer.innerHTML = "<p>No recipes yet. Add one soon!</p>";
      return;
    }
  
    // Get ratings from localStorage
    const ratedRecipes = allRecipes.map(recipe => {
      const rating = parseInt(localStorage.getItem(`rating-${recipe.title}`)) || 0;
      return { ...recipe, rating };
    });
  
    // Find highest-rated recipe
    ratedRecipes.sort((a, b) => b.rating - a.rating);
    const topRecipe = ratedRecipes[0];
  
    // Create trending card
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
  <h3>
    <a href="recipe.html?title=${encodeURIComponent(topRecipe.title)}" class="recipe-link">
      ${topRecipe.title}
    </a>
    <span class="rating">${'★'.repeat(topRecipe.rating)}${'☆'.repeat(5 - topRecipe.rating)}</span>
  </h3>
  ${topRecipe.image ? `<img src="${topRecipe.image}" alt="Recipe Image">` : ''}
  <p><strong>🌍 Region:</strong> ${topRecipe.region} | <strong>🧀 Kosher Type:</strong> ${topRecipe.kashrut} | <strong>🕯️ Holiday:</strong> ${topRecipe.holiday}</p>
  <h4>📝 Family Story</h4>
  <p>${topRecipe.story}</p>
`;


  
    trendingContainer.appendChild(card);
  }
  
  showTrendingRecipe();

  showHolidayPrep();
