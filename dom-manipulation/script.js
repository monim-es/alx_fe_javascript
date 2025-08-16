// Initial quotes array
let quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Happiness depends upon ourselves.", category: "Happiness" },
  { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
];

// Display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes available!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `<strong>${quote.text}</strong> — <em>${quote.category}</em>`;
}

// Create form to add a new quote
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  // Input for quote text
  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  quoteInput.id = "newQuoteText";

  // Input for quote category
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";

  // Add button
  const addButton = document.createElement("button");
  addButton.innerText = "Add Quote";
  addButton.addEventListener("click", function() {
    const text = quoteInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
      alert("Please enter both quote and category!");
      return;
    }

    quotes.push({ text, category });
    showRandomQuote(); // show the new quote
    quoteInput.value = "";
    categoryInput.value = "";
  });

  // Append inputs and button to form container
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Append the form container to body (or a specific div)
  document.body.appendChild(formContainer);
}

// Initialize: set up event listener and form
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
createAddQuoteForm(); // dynamically create the add quote form
