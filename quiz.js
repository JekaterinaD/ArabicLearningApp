function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic');
fetch(topic + ".json")
.then(response => response.json())
.then(data => {
  const items = data[topic];

  const generateQuestion = () => {
    const optionsEls = document.querySelectorAll(".option");

    optionsEls.forEach(el => {
      const newEl = el.cloneNode(true);
      el.parentNode.replaceChild(newEl, el);
    });

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


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const backButton = document.querySelector("#backButton");
backButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

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

function createTableFromJson(jsonData) {
  let table = document.createElement('table');
  table.classList.add('json-table');

  let thead = table.createTHead();
  let headerRow = thead.insertRow();
  let headers = ['Arabic', 'Pronunciation', 'English'];

  headers.forEach(headerText => {
    let th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

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

const urlParams1 = new URLSearchParams(window.location.search);
const topic1 = urlParams.get('topic');

const viewJsonButton1 = document.getElementById('viewJsonButton');
const hideJsonButton1 = document.getElementById('hideJsonButton');
const jsonContent1 = document.getElementById('jsonContent');

viewJsonButton.addEventListener("click", () => {
  fetch(`${topic}.json`)
    .then(response => response.json())
    .then(data => {
      const table = createTableFromJson(data[topic]);
      jsonContent.innerHTML = ''; 
      jsonContent.appendChild(table); 

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
  jsonContent.innerHTML = ''; 
});










