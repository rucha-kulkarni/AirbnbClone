// app.js
window.addEventListener("DOMContentLoaded", (event) => {

    const searchButton = document.getElementById("search-button");
    const listingsContainer = document.getElementById("listings-container");
    const detailsContainer = document.getElementById("details-container");  

    let map; 
    const mapContainer = document.getElementById("map"); 
    searchButton.addEventListener("click", () => {
        const searchInput = document.getElementById("search-input").value;

        fetch(`https://rapidapi.com/3b-data-3b-data-default/api/airbnb13/search=${searchInput}`)
            .then(response => response.json())
            .then(data => {
                listingsContainer.innerHTML = ""; 

                data.forEach(listing => {
                    const listingCard = createListingCard(listing);
                    listingsContainer.appendChild(listingCard);
                     
                    listingCard.addEventListener("click", () => {
                        displayListingDetails(listing);
                    });
                });
            })
            .catch(error => console.error('Error:', error));
    });

    
    // Create a map and display it in the map container
    function createMap() {
        map = L.map(mapContainer).setView([0, 0], 13); // Initialize the map at a default location and zoom level
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }
    
    // Call createMap to initialize the map
    createMap();

    function createListingCard(listing) {
        const listingCard = document.createElement("div");
        listingCard.classList.add("listing-card");
        listingCard.innerHTML = `
                <h2>${listing.title}</h2>
                <p>Location: ${listing.location}</p>
                <p>Price: $${listing.price}</p>
            `;

        return listingCard;
    }

    function displayListingDetails(listing) {
        // Clear previous details
        detailsContainer.innerHTML = "";

        // Create and populate a div to display listing details
        const detailsDiv = document.createElement("div");
        detailsDiv.classList.add("listing-details");

        detailsDiv.innerHTML = `
        <h2>${listing.name}</h2> 
        <p>${listing.description}</p>
        `;

        // Append the details div to the details container
        detailsContainer.appendChild(detailsDiv);
    }

    function displayMap(listing) {
        // Clear previous map markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Create a marker for the listing's location and add it to the map
        if (listing.latitude && listing.longitude) {
            const marker = L.marker([listing.latitude, listing.longitude]).addTo(map);
            marker.bindPopup(listing.name).openPopup();
            map.setView([listing.latitude, listing.longitude], 13); // Set the map view to the listing's location
        }
    }

    // Get the user's coordinates using the Geolocation API
    function getUserCoordinates() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLatitude = position.coords.latitude;
                    const userLongitude = position.coords.longitude;
                    displayListingsWithDistance(userLatitude, userLongitude);
                },
                (error) => {
                    console.error("Error getting user's location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser");
        }
    }

    // Call getUserCoordinates to get the user's location
    getUserCoordinates();

    // Display listings along with their distance from the user
    function displayListingsWithDistance(userLatitude, userLongitude) {
    
        data.forEach((listing) => {
            // Calculate the distance between the user and the listing
            const listingDistance = calculateDistance(
                userLatitude,
                userLongitude,
                listing.latitude,
                listing.longitude
            );

            // Create and populate a div to display listing details along with distance
            const detailsDiv = document.createElement("div");
            detailsDiv.classList.add("listing-details");

            detailsDiv.innerHTML = `
            <h2>${listing.name}</h2>
            <p>${listing.description}</p>
            <p>Distance: ${listingDistance.toFixed(2)} km</p>`;

            // Append the details div to the details container
            detailsContainer.appendChild(detailsDiv);
        });
    }

    // Calculate the distance between two sets of coordinates using the Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const earthRadiusKm = 6371;

        const dLat = degreesToRadians(lat2 - lat1);
        const dLon = degreesToRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degreesToRadians(lat1)) *
                Math.cos(degreesToRadians(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadiusKm * c;

        return distance;
    }

    function degreesToRadians(degrees) {
        return (degrees * Math.PI) / 180;
    }

// Create a function to calculate and display the cost breakdown for a booking
function displayCostBreakdown(booking) {
    // Calculate the total cost based on the booking details
    const basePrice = booking.listing.price;
    const nights = booking.nights;
    const totalPrice = basePrice * nights;

    // Create a div to display the cost breakdown
    const costBreakdownDiv = document.createElement("div");
    costBreakdownDiv.classList.add("cost-breakdown");

    // Customize the content of the cost breakdown div
    costBreakdownDiv.innerHTML = `
        <h2>Booking Cost Breakdown</h2>
        <p>Base Price: $${basePrice.toFixed(2)}</p>
        <p>Nights: ${nights}</p>
        <p>Total Price: $${totalPrice.toFixed(2)}</p>
    `;

    // Append the cost breakdown div to the booking details
    bookingDetails.appendChild(costBreakdownDiv);
}

// ...

// Add an event listener to display the cost breakdown when a booking is clicked
bookingList.addEventListener("click", (event) => {
    const bookingId = event.target.getAttribute("data-booking-id");

    if (bookingId) {
        const booking = bookings.find((b) => b.id === bookingId);

        if (booking) {
            // Clear existing booking details
            bookingDetails.innerHTML = "";

            // Display booking details
            displayBookingDetails(booking);

            // Display cost breakdown
            displayCostBreakdown(booking);
        }
    }
});

// Create a function to display reviews and ratings for a listing
function displayReviewsAndRatings(listing) {
    // Get the reviews and ratings data for the listing
    const reviews = listing.reviews;

    // Create a div to display reviews and ratings
    const reviewsDiv = document.createElement("div");
    reviewsDiv.classList.add("reviews-ratings");
    reviewsDiv.innerHTML = `
        <h2>Reviews and Ratings</h2>
        <ul>
            ${reviews.map((review) => `
                <li>
                    <div class="review">
                        <p>${review.text}</p>
                        <p>Rating: ${review.rating}/5</p>
                    </div>
                </li>
            `).join('')}
        </ul>
    `;

    // Append the reviews div to the listing details
    listingDetails.appendChild(reviewsDiv);
}

// ...

// Add an event listener to display reviews and ratings when a listing is clicked
listingList.addEventListener("click", (event) => {
    const listingId = event.target.getAttribute("data-listing-id");

    if (listingId) {
        const listing = listings.find((l) => l.id === listingId);

        if (listing) {
            // Clear existing listing details
            listingDetails.innerHTML = "";

            // Display listing details
            displayListingDetails(listing);

            // Display reviews and ratings
            displayReviewsAndRatings(listing);
        }
    }
});

// Create a function to indicate if a listing is a superhost
function indicateSuperhost(listing) {
    const isSuperhost = listing.superhost;

    // Create a div element to display the superhost badge/icon
    const superhostBadge = document.createElement("div");
    superhostBadge.classList.add("superhost-badge");
    superhostBadge.textContent = isSuperhost ? "Superhost" : "";

    return superhostBadge;
}

// ...

// Add an event listener to display listing details when a listing is clicked
listingList.addEventListener("click", (event) => {
    const listingId = event.target.getAttribute("data-listing-id");

    if (listingId) {
        const listing = listings.find((l) => l.id === listingId);

        if (listing) {
            // Clear existing listing details
            listingDetails.innerHTML = "";

            // Display listing details
            displayListingDetails(listing);

            // Display reviews and ratings
            displayReviewsAndRatings(listing);

            // Indicate if the listing is a superhost
            const superhostBadge = indicateSuperhost(listing);
            listingDetails.appendChild(superhostBadge);
        }
    }
});

// Create a function to indicate if a listing is a rare find
function indicateRareFind(listing) {
    const isRareFind = listing.rareFind;

    // Create a div element to display the rare find badge/icon
    const rareFindBadge = document.createElement("div");
    rareFindBadge.classList.add("rare-find-badge");
    rareFindBadge.textContent = isRareFind ? "Rare Find" : "";

    return rareFindBadge;
}

// ...

// Add an event listener to display listing details when a listing is clicked
listingList.addEventListener("click", (event) => {
    const listingId = event.target.getAttribute("data-listing-id");

    if (listingId) {
        const listing = listings.find((l) => l.id === listingId);

        if (listing) {
            // Clear existing listing details
            listingDetails.innerHTML = "";

            // Display listing details
            displayListingDetails(listing);

            // Display reviews and ratings
            displayReviewsAndRatings(listing);

            // Indicate if the listing is a superhost
            const superhostBadge = indicateSuperhost(listing);
            listingDetails.appendChild(superhostBadge);

            // Indicate if the listing is a rare find
            const rareFindBadge = indicateRareFind(listing);
            listingDetails.appendChild(rareFindBadge);
        }
    }
});

// Create a function to display amenities for a listing
function displayAmenities(listing) {
    // Create a div element to hold the list of amenities
    const amenitiesContainer = document.createElement("div");
    amenitiesContainer.classList.add("amenities-container");

    // Create a heading for the amenities section
    const amenitiesHeading = document.createElement("h3");
    amenitiesHeading.textContent = "Amenities";

    // Create an unordered list to display the amenities
    const amenitiesList = document.createElement("ul");

    // Iterate through the listing's amenities and create list items
    listing.amenities.forEach((amenity) => {
        const amenityItem = document.createElement("li");
        amenityItem.textContent = amenity;
        amenitiesList.appendChild(amenityItem);
    });

    // Append the heading and amenities list to the container
    amenitiesContainer.appendChild(amenitiesHeading);
    amenitiesContainer.appendChild(amenitiesList);

    return amenitiesContainer;
}

// Add an event listener to display listing details when a listing is clicked
listingList.addEventListener("click", (event) => {
    const listingId = event.target.getAttribute("data-listing-id");

    if (listingId) {
        const listing = listings.find((l) => l.id === listingId);

        if (listing) {
            // Clear existing listing details
            listingDetails.innerHTML = "";

            // Display listing details
            displayListingDetails(listing);

            // Display reviews and ratings
            displayReviewsAndRatings(listing);

            // Indicate if the listing is a superhost
            const superhostBadge = indicateSuperhost(listing);
            listingDetails.appendChild(superhostBadge);

            // Indicate if the listing is a rare find
            const rareFindBadge = indicateRareFind(listing);
            listingDetails.appendChild(rareFindBadge);

            // Display amenities
            const amenitiesContainer = displayAmenities(listing);
            listingDetails.appendChild(amenitiesContainer);
        }
    }
});

// Create a function to display host details for a listing
function displayHostDetails(listing) {
    // Create a div element to hold the host details
    const hostDetailsContainer = document.createElement("div");
    hostDetailsContainer.classList.add("host-details-container");

    // Create a heading for the host details section
    const hostDetailsHeading = document.createElement("h3");
    hostDetailsHeading.textContent = "Host Details";

    // Create a div to display the host's profile picture
    const hostProfilePicture = document.createElement("div");
    hostProfilePicture.classList.add("host-profile-picture");
    const profilePictureImg = document.createElement("img");
    profilePictureImg.src = listing.host.profilePicture;
    hostProfilePicture.appendChild(profilePictureImg);

    // Create a div to display the host's name and description
    const hostInfo = document.createElement("div");
    hostInfo.classList.add("host-info");
    const hostName = document.createElement("p");
    hostName.textContent = `Hosted by: ${listing.host.name}`;
    const hostDescription = document.createElement("p");
    hostDescription.textContent = listing.host.description;
    hostInfo.appendChild(hostName);
    hostInfo.appendChild(hostDescription);

    // Append the heading, profile picture, and host info to the container
    hostDetailsContainer.appendChild(hostDetailsHeading);
    hostDetailsContainer.appendChild(hostProfilePicture);
    hostDetailsContainer.appendChild(hostInfo);

    return hostDetailsContainer;
}

// ...

// Add an event listener to display listing details when a listing is clicked
listingList.addEventListener("click", (event) => {
    const listingId = event.target.getAttribute("data-listing-id");

    if (listingId) {
        const listing = listings.find((l) => l.id === listingId);

        if (listing) {
            // Clear existing listing details
            listingDetails.innerHTML = "";

            // Display listing details
            displayListingDetails(listing);

            // Display reviews and ratings
            displayReviewsAndRatings(listing);

            // Indicate if the listing is a superhost
            const superhostBadge = indicateSuperhost(listing);
            listingDetails.appendChild(superhostBadge);

            // Indicate if the listing is a rare find
            const rareFindBadge = indicateRareFind(listing);
            listingDetails.appendChild(rareFindBadge);

            // Display amenities
            const amenitiesContainer = displayAmenities(listing);
            listingDetails.appendChild(amenitiesContainer);

            // Display host details
            const hostDetailsContainer = displayHostDetails(listing);
            listingDetails.appendChild(hostDetailsContainer);
        }
    }
});
// Create a function to display navigation to the property
function displayNavigation(listing) {
    // Create a div element to hold the navigation section
    const navigationContainer = document.createElement("div");
    navigationContainer.classList.add("navigation-container");

    // Create a heading for the navigation section
    const navigationHeading = document.createElement("h3");
    navigationHeading.textContent = "Get Directions";

    // Create a button to open a map with the property's location
    const openMapButton = document.createElement("button");
    openMapButton.textContent = "Open Map";
    openMapButton.addEventListener("click", () => {
        // Use the listing's latitude and longitude to open a map in a new tab
        const mapUrl = `https://maps.google.com/?q=${listing.location.latitude},${listing.location.longitude}`;
        window.open(mapUrl, "_blank");
    });

    // Append the heading and button to the container
    navigationContainer.appendChild(navigationHeading);
    navigationContainer.appendChild(openMapButton);

    return navigationContainer;
}

// Add an event listener to display listing details when a listing is clicked
listingList.addEventListener("click", (event) => {
    const listingId = event.target.getAttribute("data-listing-id");

    if (listingId) {
        const listing = listings.find((l) => l.id === listingId);

        if (listing) {
            // Clear existing listing details
            listingDetails.innerHTML = "";

            // Display listing details
            displayListingDetails(listing);

            // Display reviews and ratings
            displayReviewsAndRatings(listing);

            // Indicate if the listing is a superhost
            const superhostBadge = indicateSuperhost(listing);
            listingDetails.appendChild(superhostBadge);

            // Indicate if the listing is a rare find
            const rareFindBadge = indicateRareFind(listing);
            listingDetails.appendChild(rareFindBadge);

            // Display amenities
            const amenitiesContainer = displayAmenities(listing);
            listingDetails.appendChild(amenitiesContainer);

            // Display host details
            const hostDetailsContainer = displayHostDetails(listing);
            listingDetails.appendChild(hostDetailsContainer);

            // Display navigation to the property
            const navigationContainer = displayNavigation(listing);
            listingDetails.appendChild(navigationContainer);
        }
    }
});
});





