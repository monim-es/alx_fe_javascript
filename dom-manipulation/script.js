// Initial quotes array
let quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Happiness depends upon ourselves.", category: "Happiness" },
  { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
];

// Display a random quote
function displayRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes available!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  // Update DOM using innerHTML
  document.getElementById("quoteDisplay").innerHTML = `<strong>${quote.text}</strong> — <em>${quote.category}</em>`;
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category!");
    return;
  }

  // Add to quotes array
  quotes.push({ text, category });

  // Update DOM to show the newly added quote immediately
  displayRandomQuote();

  // Clear input fields
  textInput.value = "";
  categoryInput.value = "";
}

// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// Event listener for "Add Quote" button
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
