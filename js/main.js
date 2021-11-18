//--------MAIN--------//
//Below you find the code responsible for maintenance of columns

// Array of column-objects - the columns array
let columns = [];

// Constructor for column-objects
function Column(color, value) {
  this.id = "col" + (columns.length + 1);
  this.color = color;
  this.value = value;
}

// Random color function
function RandColor() {
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);
  let x = "#" + randomColor;
  return x;
}

// Random number function, range 0 - 0.99
function RandValue() {
  let x = Math.random();
  x = x.toFixed(2);
  return x;
}

// Function that deletes all columns from <tr> tag in <tbody>
function removeAllChildNodesTable() {
  let columns_parent = document.getElementById("columns_parent");
  while (columns_parent.firstChild) {
    columns_parent.removeChild(columns_parent.firstChild);
  }
}

// Function for rendering columns array
function Render() {
  removeAllChildNodesTable();
  for (i = 0; i < columns.length; i++) {
    let columns_parent = document.getElementById("columns_parent");
    let colToAdd = document.createElement("td");
    colToAdd.setAttribute("id", columns[i].id);
    colToAdd.style.setProperty("--size", columns[i].value);
    colToAdd.style.setProperty("--color", columns[i].color);
    colToAdd.innerHTML = columns[i].value;
    columns_parent.appendChild(colToAdd);
  }
}

// Function that spawn new column
function Spawn() {
  columns.push(new Column(RandColor(), RandValue()));
  Render();
}

// Function for randomizing values of spawned columns
function Randomize() {
  for (i = 0; i < columns.length; i++) {
    columns[i].value = RandValue();
  }
  Render();
  // In case of situation where user calls Randomize function before algorithm finished sorting
  bubbleIndex = 0;
  selectIndex = 0;
}

// Function that deletes all paragraphs from from under the table
function removeAllChildNodesIndicators() {
  let indicators_parent = document.getElementById("indicators_parent");
  while (indicators_parent.firstChild) {
    indicators_parent.removeChild(indicators_parent.firstChild);
  }
}

//Function for rendering indicator messages
function renderIndicator(message) {
  removeAllChildNodesIndicators();
  let indicators_parent = document.getElementById("indicators_parent");
  let msgToAdd = document.createElement("p");
  msgToAdd.setAttribute("class", "indicator");
  msgToAdd.innerHTML = message;
  indicators_parent.appendChild(msgToAdd);
}

//--------SORTING--------//
//Below you find the code responsible for sorting algorithms

//Variable shared by all sorting algorithms functions, it holds interval id for setInterval methods
let interval;

//--Insertion Sort--//

//This function is one "step" of the insertion sort
function insertionSortStep() {
  let currentIndex = 1;
  let lastUnsorted = currentIndex - 1;
  while (columns[currentIndex].value >= columns[lastUnsorted].value) {
    currentIndex++;
    lastUnsorted = currentIndex - 1;
    if (columns[currentIndex] === undefined) {
      console.log("Columns are sorted");
      clearInterval(interval);
      renderIndicator("Sorting is finished. Randomize and sort again :)");
      return columns;
    }
  }
  if (columns[currentIndex].value < columns[lastUnsorted].value) {
    let currentElement = columns[currentIndex];
    columns[lastUnsorted + 1] = columns[lastUnsorted];
    columns[lastUnsorted] = currentElement;
  }
}

//This function calls one step of insertion sort every given interval
function insertionSort() {
  renderIndicator("Sorting in progress...");
  interval = setInterval(function () {
    insertionSortStep();
    Render();
  }, 500);
}

//--Bubble Sort--//

//Value of this variable tells which element of the columns array is being tested in current step.
//bubbleIndex resets after iterating through all elements of the columns array.
let bubbleIndex = 0;

//Function bubbleSortStep "knows" that array is sorted when number of noSwaps matches columns.length - 1.
//NoSwaps incrementation occurs when... tested element doesn't have to be swapped with next element.
let noSwaps = 0;

//This function is one "step" of the bubble sort
function bubbleSortStep() {
  let n = columns.length - 1;
  let currentElement = columns[bubbleIndex];
  let nextElement = columns[bubbleIndex + 1];
  if (columns[bubbleIndex].value > columns[bubbleIndex + 1].value) {
    columns[bubbleIndex] = nextElement;
    columns[bubbleIndex + 1] = currentElement;
    Render();
  } else {
    noSwaps++;
  }
  bubbleIndex++;

  //Checks if the array is sorted
  if (noSwaps === n) {
    clearInterval(interval);
    bubbleIndex = 0;
    noSwaps = 0;
    console.log("Columns are sorted");
    renderIndicator("Sorting is finished. Randomize and sort again :)");
  }

  if (bubbleIndex === n) {
    bubbleIndex = 0;
    noSwaps = 0;
  }
}

//This function calls one step of the bubble sort every given interval
function bubbleSort() {
  renderIndicator("Sorting in progress...");
  interval = setInterval(function () {
    bubbleSortStep();
    Render();
  }, 500);
}

//--Selection Sort--//

//Value of this variable tells which element of the columns array is being tested in current step.
let selectIndex = 0;

//This function is one "step" of the selection sort
function selectionSortStep() {
  let indexOfMin = selectIndex;
  for (let i = selectIndex + 1; i < columns.length; i++) {
    if (columns[i].value < columns[indexOfMin].value) {
      indexOfMin = i;
    }
  }
  if (indexOfMin !== selectIndex) {
    [columns[selectIndex], columns[indexOfMin]] = [
      columns[indexOfMin],
      columns[selectIndex],
    ];
  }
  selectIndex++;
  if (selectIndex === columns.length) {
    selectIndex = 0;
    clearInterval(interval);
    console.log("Columns are sorted");
    renderIndicator("Sorting is finished. Randomize and sort again :)");
  }
}

//This function calls one step of the selection sort every given interval
function selectionSort() {
  renderIndicator("Sorting in progress...");
  interval = setInterval(function () {
    selectionSortStep();
    Render();
  }, 500);
}
