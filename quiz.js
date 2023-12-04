// Function to get URL parameters
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Get the topic from URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic');

// Load the JSON data based on the topic
// ... [rest of your code remains unchanged]

fetch(topic + ".json")
.then(response => response.json())
.then(data => {
  const items = data[topic];

  const generateQuestion = () => {
    const optionsEls = document.querySelectorAll(".option");

    // Replace each option element with a fresh one to clear old event listeners
    optionsEls.forEach(el => {
      const newEl = el.cloneNode(true);
      el.parentNode.replaceChild(newEl, el);
    });

    // Now, re-query the option elements to get the new ones
    const freshOptionsEls = document.querySelectorAll(".option");

    const usedIndexesArray = [];
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomWord = items[randomIndex].english;
    const options = [items[randomIndex].arabic];
    const usedIndexes = new Set();
    usedIndexes.add(randomIndex);

    while (options.length < 3) {
      const randomOptionIndex = Math.floor(Math.random() * items.length);
      if (!usedIndexes.has(randomOptionIndex)) {
        options.push(items[randomOptionIndex].arabic);
        usedIndexes.add(randomOptionIndex);
        usedIndexesArray.push(randomOptionIndex);
      }
    }

    shuffle(options);

    const feedbackEl = document.getElementById("feedback");
    const questionEl = document.querySelector("#question");

    questionEl.textContent = `What is the Arabic word for "${randomWord}"?`;

    freshOptionsEls.forEach((el, index) => {
      el.textContent = options[index];

      // Check if the index exists in items and in usedIndexesArray before setting the attribute
      if (items[usedIndexesArray[index]]) {
        el.setAttribute("data-pronounce", items[usedIndexesArray[index]].pronounce);
      } else {
        console.error(`Index ${usedIndexesArray[index]} is not valid in items. Available items length: ${items.length}`);
      }

      el.addEventListener("click", () => {
        feedbackEl.textContent = "";

        if (el.textContent === items[randomIndex].arabic) {
          feedbackEl.textContent = "Correct!";
          feedbackEl.style.color = "green";
          setTimeout(() => {
            feedbackEl.textContent = "";
            generateQuestion();
          }, 1000);
        } else {
          feedbackEl.textContent = "Incorrect. Try again.";
          feedbackEl.style.color = "red";
        }
      });
    });
  };

  generateQuestion();
})
.catch(error => {
  console.error("Failed to fetch data:", error);
});

// ... [rest of your code remains unchanged]


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Handle the back button click event
const backButton = document.querySelector("#backButton");
backButton.addEventListener("click", () => {
  window.location.href = "startPageQuiz.html";
});

// Handle the view JSON button click event
const viewJsonButton = document.querySelector("#viewJsonButton");
const hideJsonButton = document.querySelector("#hideJsonButton");
const jsonContent = document.querySelector("#jsonContent");

viewJsonButton.addEventListener("click", () => {
  fetch(`${topic}.json`)
  .then(response => response.json())
  .then(data => {
    jsonContent.textContent = JSON.stringify(data, null, 2);
    viewJsonButton.style.display = "none";
    hideJsonButton.style.display = "block";
    jsonContent.style.display = "block";
  })
  .catch(error => {
    console.error("Error fetching JSON:", error);
  });
});

hideJsonButton.addEventListener("click", () => {
  viewJsonButton.style.display = "block";
  hideJsonButton.style.display = "none";
  jsonContent.style.display = "none";
});

/*function createTableFromJson(jsonData) {
  let table = document.createElement('table');
  table.classList.add('json-table');

  // Add the header row
  let header = table.createTHead();
  let headerRow = header.insertRow(0);
  let headers = ['Arabic', 'Pronunciation', 'English'];
  headers.forEach(headerText => {
    let headerCell = document.createElement('th');
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });

  // Add the body rows
  let body = table.createTBody();
  jsonData.forEach(item => {
    let row = body.insertRow();
    Object.values(item).forEach(text => {
      let cell = row.insertCell();
      cell.textContent = text;
    });
  });

  return table;
}

viewJsonButton.addEventListener("click", () => {
  fetch(`${topic}.json`)
    .then(response => response.json())
    .then(data => {
      let table = createTableFromJson(data.family); // Assuming 'family' is the topic
      let tableContainer = document.getElementById('jsonContent');
      tableContainer.innerHTML = ''; // Clear previous content
      tableContainer.appendChild(table);
      viewJsonButton.style.display = "none";
      hideJsonButton.style.display = "block";
      jsonContent.style.display = "block";
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
    });
});*/
// Function to create a table from JSON data
function createTableFromJson(jsonData) {
  let table = document.createElement('table');
  table.classList.add('json-table');

  // Add the header row
  let thead = table.createTHead();
  let headerRow = thead.insertRow();
  let headers = ['Arabic', 'Pronunciation', 'English'];

  headers.forEach(headerText => {
    let th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  // Add the body rows
  let tbody = table.createTBody();

  jsonData.forEach(item => {
    let row = tbody.insertRow();
    Object.values(item).forEach(text => {
      let cell = row.insertCell();
      cell.textContent = text;
    });
  });

  return table;
}

// Get the topic from URL query parameters
const urlParams1 = new URLSearchParams(window.location.search);
const topic1 = urlParams.get('topic');

// Get the elements
const viewJsonButton1 = document.getElementById('viewJsonButton');
const hideJsonButton1 = document.getElementById('hideJsonButton');
const jsonContent1 = document.getElementById('jsonContent');

viewJsonButton.addEventListener("click", () => {
  fetch(`${topic}.json`)
    .then(response => response.json())
    .then(data => {
      // Use the createTableFromJson function to generate a table from JSON data
      const table = createTableFromJson(data[topic]);
      jsonContent.innerHTML = ''; // Clear previous content
      jsonContent.appendChild(table); // Add the table to jsonContent div

      // Update the display properties
      viewJsonButton.style.display = "none";
      hideJsonButton.style.display = "block";
      jsonContent.style.display = "block";
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
    });
});

hideJsonButton.addEventListener("click", () => {
  viewJsonButton.style.display = "block";
  hideJsonButton.style.display = "none";
  jsonContent.style.display = "none";
  jsonContent.innerHTML = ''; // Clear the table when hiding the content
});










