const CACHE_SIZE = 3; // Maximum size of the cache
let cache = new Map();
let hits = 0;
let misses = 0;

function addToCache() {
    let inputValue = document.getElementById("input").value.trim();
    if (inputValue === "") {
        alert("Please enter a value. 😊😊");
        return;
    }

    // Check if the cache already contains the value
    if (cache.has(inputValue)) {
        // Cache hit, move the accessed item to the most recently used position
        cache.delete(inputValue);
        cache.set(inputValue, inputValue);
        hits++;
    } else {
        // Cache miss, update statistics
        misses++;
        
        // If cache is full, remove the least recently used item
        if (cache.size >= CACHE_SIZE) {
            const leastRecentlyUsed = Array.from(cache.keys())[0];
            cache.delete(leastRecentlyUsed);
        }
        // Add the new item to the cache
        cache.set(inputValue, inputValue);
    }

    displayCache();
    updateStats();
}

function displayCache() {
    const cacheDiv = document.getElementById("cache");
    cacheDiv.innerHTML = "";

    // Display the contents of the cache
    cache.forEach((value, key) => {
        const cacheItem = document.createElement("div");
        cacheItem.textContent = key;
        cacheDiv.appendChild(cacheItem);
    });
}

function updateStats() {
    const totalRequests = hits + misses;
    const hitRatio = (hits / totalRequests * 100).toFixed(2);
    const missRatio = (misses / totalRequests * 100).toFixed(2);
    document.getElementById("stats").textContent = `Hit ratio: ${hitRatio}%, Miss ratio: ${missRatio}%`;
}
