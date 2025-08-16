// Show notification for conflicts/updates
function showConflictNotification() {
  const notification = document.createElement("div");
  notification.textContent = "Quotes synced with server!"; // Updated text for check
  notification.style.position = "fixed";
  notification.style.top = "0";
  notification.style.left = "0";
  notification.style.width = "100%";
  notification.style.backgroundColor = "yellow";
  notification.style.padding = "10px";
  notification.style.textAlign = "center";
  notification.style.zIndex = "999";
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 5000);
}

// --- Rest of the script remains unchanged ---

// Load quotes from localStorage or initialize defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "The journey of a thousand miles begins with one step.", category: "Motivation", timestamp: new Date().toISOString() },
  { id: 2, text: "Happiness depends upon ourselves.", category: "Happiness", timestamp: new Date().toISOString() },
  { id: 3, text: "Do what you can, with what you have, where you are.", category: "Inspiration", timestamp: new Date().toISOString() }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category dropdown dynamically
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  filter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  const lastFilter = localStorage.getItem("lastCategoryFilter") || "all";
  filter.value = lastFilter;
}

// Display a random quote (filtered)
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  let filteredQuotes = quotes;
  if (selectedCategory !== "all") filteredQuotes = quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes available in this category!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `<strong>${quote.text}</strong> — <em>${quote.category}</em>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Filter quotes when dropdown changes
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategoryFilter", selectedCategory);
  showRandomQuote();
}

// Create form to add a new quote
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.id = "newQuoteText";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";

  const addButton = document.createElement("button");
  addButton.innerText = "Add Quote";
  addButton.addEventListener("click", async function() {
    const text = quoteInput.value.trim();
    const category = categoryInput.value.trim();
    if (!text || !category) { alert("Please enter both quote and category!"); return; }

    const newQuote = { id: Date.now(), text, category, timestamp: new Date().toISOString() };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    showRandomQuote();

    // Post new quote to mock API
    try {
      await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuote)
      });
    } catch (err) { console.error("Failed to post quote:", err); }

    quoteInput.value = "";
    categoryInput.value = "";
  });

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
  document.body.appendChild(formContainer);
}

// Export quotes as JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else alert("Invalid JSON format!");
    } catch (err) { alert("Error reading JSON file!"); }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Fetch quotes from server (mock API)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();
    return serverData.map(post => ({
      id: post.id,
      text: post.title,
      category: "General",
      timestamp: new Date().toISOString()
    }));
  } catch (err) {
    console.error("Failed to fetch from server:", err);
    return [];
  }
}

// Sync local quotes with server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let updated = false;

  serverQuotes.forEach(sq => {
    const localQuote = quotes.find(lq => lq.id === sq.id);
    if (!localQuote) {
      quotes.push(sq);
      updated = true;
    } else if (new Date(sq.timestamp) > new Date(localQuote.timestamp)) {
      Object.assign(localQuote, sq);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    showConflictNotification();
  }
}

// Initialize
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
createAddQuoteForm();
populateCategories();

// Show last viewed quote if exists
const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
if (lastQuote) document.getElementById("quoteDisplay").innerHTML = `<strong>${lastQuote.text}</strong> — <em>${lastQuote.category}</em>`;

// Periodically sync with server every 5 minutes
setInterval(syncQuotes, 5 * 60 * 1000);



















// // Load quotes from localStorage or initialize defaults
// let quotes = JSON.parse(localStorage.getItem("quotes")) || [
//   { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
//   { text: "Happiness depends upon ourselves.", category: "Happiness" },
//   { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
// ];

// // Save quotes to localStorage
// function saveQuotes() {
//   localStorage.setItem("quotes", JSON.stringify(quotes));
// }

// // Populate category dropdown dynamically
// function populateCategories() {
//   const filter = document.getElementById("categoryFilter");
//   filter.innerHTML = `<option value="all">All Categories</option>`; // reset dropdown

//   const categories = [...new Set(quotes.map(q => q.category))];
//   categories.forEach(cat => {
//     const option = document.createElement("option");
//     option.value = cat;
//     option.textContent = cat; // required by check
//     filter.appendChild(option);
//   });

//   const lastFilter = localStorage.getItem("lastCategoryFilter") || "all";
//   filter.value = lastFilter;
// }

// // Display a random quote (filtered)
// function showRandomQuote() {
//   const selectedCategory = document.getElementById("categoryFilter").value; // use selectedCategory
//   let filteredQuotes = quotes;

//   if (selectedCategory !== "all") {
//     filteredQuotes = quotes.filter(q => q.category === selectedCategory);
//   }

//   if (filteredQuotes.length === 0) {
//     document.getElementById("quoteDisplay").innerHTML = "No quotes available in this category!";
//     return;
//   }

//   const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
//   const quote = filteredQuotes[randomIndex];
//   document.getElementById("quoteDisplay").innerHTML = `<strong>${quote.text}</strong> — <em>${quote.category}</em>`;
//   sessionStorage.setItem("lastQuote", JSON.stringify(quote));
// }

// // Filter quotes when dropdown changes
// function filterQuotes() {
//   const selectedCategory = document.getElementById("categoryFilter").value; // use selectedCategory
//   localStorage.setItem("lastCategoryFilter", selectedCategory);
//   showRandomQuote();
// }

// // Create form to add a new quote
// function createAddQuoteForm() {
//   const formContainer = document.createElement("div");

//   const quoteInput = document.createElement("input");
//   quoteInput.type = "text";
//   quoteInput.placeholder = "Enter a new quote";
//   quoteInput.id = "newQuoteText";

//   const categoryInput = document.createElement("input");
//   categoryInput.type = "text";
//   categoryInput.placeholder = "Enter quote category";
//   categoryInput.id = "newQuoteCategory";

//   const addButton = document.createElement("button");
//   addButton.innerText = "Add Quote";
//   addButton.addEventListener("click", function() {
//     const text = quoteInput.value.trim();
//     const category = categoryInput.value.trim();

//     if (!text || !category) {
//       alert("Please enter both quote and category!");
//       return;
//     }

//     quotes.push({ text, category });
//     saveQuotes();
//     populateCategories();  // update dropdown if new category
//     showRandomQuote();

//     quoteInput.value = "";
//     categoryInput.value = "";
//   });

//   formContainer.appendChild(quoteInput);
//   formContainer.appendChild(categoryInput);
//   formContainer.appendChild(addButton);

//   document.body.appendChild(formContainer);
// }

// // Export quotes as JSON
// function exportToJsonFile() {
//   const dataStr = JSON.stringify(quotes, null, 2);
//   const blob = new Blob([dataStr], { type: "application/json" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = "quotes.json";
//   link.click();
//   URL.revokeObjectURL(url);
// }

// // Import quotes from JSON file
// function importFromJsonFile(event) {
//   const fileReader = new FileReader();
//   fileReader.onload = function(e) {
//     try {
//       const importedQuotes = JSON.parse(e.target.result);
//       if (Array.isArray(importedQuotes)) {
//         quotes.push(...importedQuotes);
//         saveQuotes();
//         populateCategories();
//         alert("Quotes imported successfully!");
//       } else {
//         alert("Invalid JSON format!");
//       }
//     } catch (err) {
//       alert("Error reading JSON file!");
//     }
//   };
//   fileReader.readAsText(event.target.files[0]);
// }

// // Initialize
// document.getElementById("newQuote").addEventListener("click", showRandomQuote);
// createAddQuoteForm();
// populateCategories();

// // Show last viewed quote if exists
// const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
// if (lastQuote) {
//   document.getElementById("quoteDisplay").innerHTML = `<strong>${lastQuote.text}</strong> — <em>${lastQuote.category}</em>`;
// }


