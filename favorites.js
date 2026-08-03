// ===================================
// Favorite Cities Module
// ===================================

let favoriteCities =
JSON.parse(localStorage.getItem("favoriteCities")) || [];

const favoriteBtn =
document.getElementById("favoriteBtn");

const favoritesContainer =
document.getElementById("favoritesContainer");

const clearFavoritesBtn =
document.getElementById("clearFavoritesBtn");

let currentCity = "";

function saveFavorite(city){

    if(city==="") return;

    if(!favoriteCities.includes(city)){

        favoriteCities.push(city);

        localStorage.setItem(
            "favoriteCities",
            JSON.stringify(favoriteCities)
        );

        displayFavorites();

    }

}

function displayFavorites(){

    favoritesContainer.innerHTML="";

    favoriteCities.forEach(city=>{

        const btn=document.createElement("button");

        btn.className="favorite-btn";

        btn.textContent="⭐ "+city;

        btn.onclick=()=>{

            getWeather(city);

        };

        favoritesContainer.appendChild(btn);

    });

}

function clearFavorites(){

    favoriteCities=[];

    localStorage.removeItem("favoriteCities");

    displayFavorites();

}

favoriteBtn.addEventListener("click",()=>{

    saveFavorite(currentCity);

});

clearFavoritesBtn.addEventListener(
    "click",
    clearFavorites
);

displayFavorites();