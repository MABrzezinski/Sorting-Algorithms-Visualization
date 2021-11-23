//--MAIN----------------------------------------------------------------------------//
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
function render() {
  removeAllChildNodesTable();
  for (i = 0; i < columns.length; i++) {
    let columns_parent = document.getElementById("columns_parent");
    let colToAdd = document.createElement("td");
    // colToAdd.setAttribute("id", columns[i].id);
    colToAdd.style.setProperty("--size", columns[i].value);
    colToAdd.style.setProperty("--color", columns[i].color);
    colToAdd.innerHTML = columns[i].value;
    columns_parent.appendChild(colToAdd);
  }
}

// Does the same what render() does but first it renders array with sorted elements for heap sort and then remaining elements
// from columns array.
function renderForHeap() {
  removeAllChildNodesTable();
  for (i = 0; i < heapArray.length; i++) {
    let columns_parent = document.getElementById("columns_parent");
    let colToAdd = document.createElement("td");
    // colToAdd.setAttribute("id", heapArray[i].id);
    colToAdd.style.setProperty("--size", heapArray[i].value);
    colToAdd.style.setProperty("--color", heapArray[i].color);
    colToAdd.innerHTML = heapArray[i].value;
    columns_parent.appendChild(colToAdd);
  }
  for (i = 0; i < columns.length; i++) {
    let columns_parent = document.getElementById("columns_parent");
    let colToAdd = document.createElement("td");
    // colToAdd.setAttribute("id", columns[i].id);
    colToAdd.style.setProperty("--size", columns[i].value);
    colToAdd.style.setProperty("--color", columns[i].color);
    colToAdd.innerHTML = columns[i].value;
    columns_parent.appendChild(colToAdd);
  }
}

// Function that spawn new column
function Spawn() {
  columns.push(new Column(RandColor(), RandValue()));
  render();
  //heapIndex is defined in Heap Sort section. It is being updated after every spawn, because we want to heapify from the last element of the columns array.
  heapIndex = columns.length - 1;
}

// Function for randomizing values of spawned columns
function Randomize() {
  for (i = 0; i < columns.length; i++) {
    columns[i].value = RandValue();
  }
  render();
  // In case of situation where user calls Randomize function before algorithm finished sorting
  bubbleIndex = 0;
  selectIndex = 0;
  heapIndex = columns.length - 1;
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

//--SORTING----------------------------------------------------------------------------//
//Below you find the code responsible for sorting algorithms

//Variable shared by all sorting algorithms functions, it holds interval id for setInterval methods
let interval;

//---Insertion Sort---//

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
    render();
  }, 500);
}

//---Bubble Sort---//

//Value of this variable tells which element of the columns array is being tested in current step.
//bubbleIndex resets after iterating through all elements of the columns array.
let bubbleIndex = 0;

//Function bubbleSortStep "knows" that array is sorted when number of noSwaps matches columns.length - 1.
//NoSwaps incrementation occurs when tested element doesn't have to be swapped with next element.
let noSwaps = 0;

//This function is one "step" of the bubble sort
function bubbleSortStep() {
  let n = columns.length - 1;
  let currentElement = columns[bubbleIndex];
  let nextElement = columns[bubbleIndex + 1];
  if (columns[bubbleIndex].value > columns[bubbleIndex + 1].value) {
    columns[bubbleIndex] = nextElement;
    columns[bubbleIndex + 1] = currentElement;
    render();
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
    render();
  }, 500);
}

//---Selection Sort---//

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
    render();
  }, 500);
}

//---Heap Sort---//

// Heap property
// -------------
// leftChildIndex = (2 * parentIndex) + 1
// so...
// parentIndex = (leftChildIndex - 1) / 2
//
// rightChildIndex = (2 * parentIndex) + 2
// parentIndex = (rightChildIndex - 2) / 2

// Variable holds index of rightmost unheapified node.
let heapIndex = columns.length - 1;

//Function minHeapSortStep "knows" that array is heapified when number of noSwaps matches number of parent nodes.
//NoSwaps incrementation occurs when tested parent-child trio or duo doesn't need to be swapped between each other.
let heapNoSwaps = 0;

// Array of sorted elements.
let heapArray = [];

//This function 
function minHeapSortStep() {

  //If heapIndex points to the root of the tree then it starts from the end.
  if (heapIndex === 0) {
    heapIndex = columns.length - 1;
    heapNoSwaps = 0;
  }

  //Checks if the rightmost unheapified child-node is a right child (which means it has a sibling) or a left child (means it has not).
  //Since root element has index 0, if checked node has index represented by even number - it means it is the node is right child.
  if (heapIndex % 2 === 0) { //Two child nodes.
    
    //Finds child node with lower value.
    let lowerOfTwo = columns[heapIndex].value < columns[heapIndex - 1].value ? heapIndex : heapIndex - 1;

    //If child node with lower value has lower value than parent, then they swap.
    if (columns[lowerOfTwo].value < columns[(heapIndex - 2) / 2].value) { //explained in comment about heap property.
      [columns[lowerOfTwo], columns[(heapIndex - 2) / 2]] = [columns[(heapIndex - 2) / 2], columns[lowerOfTwo]];
      // Moves to another rightmost unheapified parent - children trio.
      heapIndex = heapIndex - 2;

    } else { // Parent has lower value than children. There's no swap. 
      heapNoSwaps++;
      // Moves to another parent with two child nodes.
      heapIndex = heapIndex - 2;
    }

  } else { //One child node.

    //If child node has lower value than parent, then they swap.
    if (columns[heapIndex].value < columns[(heapIndex - 1) / 2].value) {
      [columns[heapIndex], columns[(heapIndex - 1) / 2]] = [columns[(heapIndex - 1) / 2], columns[heapIndex]];

      // Moves to another rightmost unheapified parent - children trio. 
      heapIndex--;

    } else { // Parent has lower value than children. There's no swap. 
      heapNoSwaps++;
      
      // Moves to another rightmost unheapified parent - children trio.
      heapIndex--;
    }
  }

  //If number of heapNoSwaps equals number of possible swaps in given tree, it means array is heapified.
  //Root element goes to array with sorted elements. Last element of columns array take the root place.
  if (heapNoSwaps === Math.ceil((columns.length - 1) / 2)) {
    console.log("heapified");
    heapArray.push(columns[0]);
    columns[0] = columns[columns.length - 1];
    columns.splice(columns.length - 1, 1);
  }

  renderForHeap();

  if (columns.length === 1) {
    heapArray.push(columns[0]);
    columns = heapArray;
    heapArray = [];
    clearInterval(interval);
    console.log("Columns are sorted");
    renderIndicator("Sorting is finished. Randomize and sort again :)");
  }
}

//This function calls one step of the heap sort every given interval
function heapSort() {
  renderIndicator("Sorting in progress...");
  interval = setInterval(function () {
    minHeapSortStep();
  }, 500);
}
