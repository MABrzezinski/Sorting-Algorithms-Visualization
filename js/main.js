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
  renderIndicator("Choose a sorting algorithm or spawn more columns.");
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

// Safety in case someone spawn only one element and then attempt to sort it.
function ifOne() {
  
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
  // Safety in case someone spawn zero or only one element and then attempt to sort it.
  if (columns.length <= 1) {
    renderIndicator("There is not enough columns to sort. Spawn more :)");
    clearInterval(interval);
    return;
  }
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
  // Safety in case someone spawn zero or only one element and then attempt to sort it.
  if (columns.length <= 1) {
    renderIndicator("There is not enough columns to sort. Spawn more :)");
    clearInterval(interval);
    return;
  }
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
  // Safety in case someone spawn zero or only one element and then attempt to sort it.
  if (columns.length <= 1) {
    renderIndicator("There is not enough columns to sort. Spawn more :)");
    clearInterval(interval);
    return;
  }
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
  if (heapIndex % 2 === 0) {
    //Two child nodes.

    //Finds child node with lower value.
    let lowerOfTwo =
      columns[heapIndex].value < columns[heapIndex - 1].value
        ? heapIndex
        : heapIndex - 1;

    //If child node with lower value has lower value than parent, then they swap.
    if (columns[lowerOfTwo].value < columns[(heapIndex - 2) / 2].value) {
      //explained in comment about heap property.
      [columns[lowerOfTwo], columns[(heapIndex - 2) / 2]] = [
        columns[(heapIndex - 2) / 2],
        columns[lowerOfTwo],
      ];
      // Moves to another rightmost unheapified parent - children trio.
      heapIndex = heapIndex - 2;
    } else {
      // Parent has lower value than children. There's no swap.
      heapNoSwaps++;
      // Moves to another parent with two child nodes.
      heapIndex = heapIndex - 2;
    }
  } else {
    //One child node.

    //If child node has lower value than parent, then they swap.
    if (columns[heapIndex].value < columns[(heapIndex - 1) / 2].value) {
      [columns[heapIndex], columns[(heapIndex - 1) / 2]] = [
        columns[(heapIndex - 1) / 2],
        columns[heapIndex],
      ];

      // Moves to another rightmost unheapified parent - children trio.
      heapIndex--;
    } else {
      // Parent has lower value than children. There's no swap.
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
  // Safety in case someone spawn zero or only one element and then attempt to sort it.
  if (columns.length <= 1) {
    renderIndicator("There is not enough columns to sort. Spawn more :)");
    clearInterval(interval);
    return;
  }
  renderIndicator("Sorting in progress...");
  interval = setInterval(function () {
    minHeapSortStep();
  }, 500);
}

//---Merge Sort---//
// Merge sort is essentially simple code that merges and sorts arrays. It compares first elements of two internally sorted arrays (one element array is internally sorted) and then pushes element with lower value to an array that holds merged and sorted elements. When I am reffering to merge sorting, I am reffering to this.
// For now Merge Sort works only for arrays that have maximum of 8 elements. To explain this I need to explain how the implementation works. I assume that reader has a knowledge about merge sorting.
// First of all it takes an array and halves it (Math.floor) to left and right unsorted arrays. Then function mergeHalfing() halves each of left and right unsorted arrays and nest it in respective arrays. It looks like this mergeLeftUnsorted = [1,3,2] => [[1],[3,2]]. I did it to be able sort every 2-elements subarray, and then sort-merge it with remaining subarray. So the next step is [[1],[3,2]] => mergeLeftSorted = [1,2,3]. And then mergeLeftSorted is being merge-sorted with mergeRightSorted. Okay so where's the problem?
// There is no logic for situation where merge(Left/Right)Unsorted has more than 2 subarrays, so for example mergeLeftUnsorted after mergeHalfing() = [[1,2],[3],[4,5]]. Trying to implement the logic I found out that I can't do it elegantly without hardcoding (for example different rules for 3 subarrays and different for let's say 7 subarrays). Because I couldn't come up with universal code for all situations I decided I'm not gonna hardcode at all. I just need to find another solution.
// My suspicion is I could write a function that would do halving and nesting to mirror the principle behind merge sort algorithm. So for example [1,2,3,4,5,6,7,8,9,10] => [[[1,2],[3],[4,5]],[[6,7],[8],[9,10]]]
// or this for 25-element array:
// [[[[[0],[0,0]],[[0],[0,0]]],[[[0],[0,0]],[[0],[0,0]]]],[[[[0],[0,0]],[[0],[0,0]]],[[[0],[0,0]],[[0,0],[0,0]]]]]
// This way I would never have to work with more than 3 subarrays on one depth-level. That would give universality I need in my code.

// Function takes an array and nest every next remaining half (Math.floor) inside of it, for as long as there are 2 elements remaining. For example:
// array = [1, 2, 3]
// array = mergeHalfing(array); / result is: [[1],[2,3]]
function mergeHalfing(a) {
  let array = a;
  let helper = [];
  let mergeHalfed = [];
  let i = 0;
  while (array.length !== 0 || helper.length !== 0) {
    i++;
    if (array.length <= 2) {
      mergeHalfed.push(array.splice(0));
      array = helper;
      helper = [];
    }
    if (array.length === 3) {
      mergeHalfed.push(array.splice(0, 1));
      mergeHalfed.push(array.splice(0));
      array = helper;
      helper = [];
    }
    if (array.length > 3) {
      let middle = Math.floor(array.length / 2);
      helper = [...array.splice(middle), ...helper];
    }
  }
  return mergeHalfed;
}

// Variables needed in mergeSortStep()
let mergeLeftUnsort = [];
let mergeLeftSorted = [];
let mergeRightUnsort = [];
let mergeRightSorted = [];
let mergeTemp = [];
let leftRightDivided = false;

// Calls one step of merge sort
function mergeSortStep() {

  // Explained in intro to merge sort section.
  if (columns.length > 8) {
    renderIndicator(
      "Sorry but Merge Sort works only for maximum of 8 columns :(<br/>Refresh and spawn less columns or choose another algorithm."
    );
    return;
  }

  // On first step it takes columns array and distributes halves of it to separate arrays. Then the elements are being grouped into smaller and smaller halves arrays (Math.floor based), with maximum elements of 2.
  if (!leftRightDivided) {
    let middle = Math.floor(columns.length / 2);
    mergeLeftUnsort = columns.slice(0, middle);
    mergeRightUnsort = columns.slice(middle);

    mergeLeftUnsort = mergeHalfing(mergeLeftUnsort);
    mergeRightUnsort = mergeHalfing(mergeRightUnsort);

    leftRightDivided = true;
  }

  // Every 2-element array inside of mergeLeftUnsort is beign sorted. For example [[1], [3,2]] => [[1], [2,3]]
  for (let i = 0; i < mergeLeftUnsort.length; i++) {
    if (mergeLeftUnsort[i].length === 2) {
      if (mergeLeftUnsort[i][1].value < mergeLeftUnsort[i][0].value) {
        [mergeLeftUnsort[i][1], mergeLeftUnsort[i][0]] = [
          mergeLeftUnsort[i][0],
          mergeLeftUnsort[i][1],
        ];
        columns = [...mergeLeftUnsort.flat(), ...mergeRightUnsort.flat()];
        render();
        return;
      }
    }
  }

  // Every 2-element array inside of mergeRightUnsort is beign sorted. For example [[1], [3,2]] => [[1], [2,3]]
  for (let i = 0; i < mergeRightUnsort.length; i++) {
    if (mergeRightUnsort[i].length === 2) {
      if (mergeRightUnsort[i][1].value < mergeRightUnsort[i][0].value) {
        [mergeRightUnsort[i][1], mergeRightUnsort[i][0]] = [
          mergeRightUnsort[i][0],
          mergeRightUnsort[i][1],
        ];
        columns = [...mergeLeftUnsort.flat(), ...mergeRightUnsort.flat()];
        render();
        return;
      }
    }
  }

  // Arrays inside of mergeLeftUnsort are being merge sorted into mergeLeftSorted
  if (mergeLeftUnsort.length > 0) {
    mergeLeftUnsort = mergeLeftUnsort.filter(function (el) {
      return el.length != 0;
    });
    if (mergeLeftUnsort.length === 1) {
      mergeLeftSorted = [...mergeLeftSorted, ...mergeLeftUnsort.flat()];
      mergeLeftUnsort = [];
      columns = [...mergeLeftSorted.flat(), ...mergeRightUnsort.flat()];
      render();
      return;
    }
    mergeLeftSorted = [
      ...mergeLeftSorted,
      ...(mergeLeftUnsort[0][0].value > mergeLeftUnsort[1][0].value
        ? mergeLeftUnsort[1].splice(0, 1)
        : mergeLeftUnsort[0].splice(0, 1)),
    ];
    mergeLeftSorted = mergeLeftSorted.flat();
    columns = [
      ...mergeLeftSorted.flat(),
      ...mergeLeftUnsort.flat(),
      ...mergeRightUnsort.flat(),
    ];
    render();
    return;
  }

  // Arrays inside of mergeRightUnsort are being merge sorted into mergeRightSorted
  if (mergeRightUnsort.length > 0) {
    mergeRightUnsort = mergeRightUnsort.filter(function (el) {
      return el.length != 0;
    });
    if (mergeRightUnsort.length === 1) {
      mergeRightSorted = [...mergeRightSorted, ...mergeRightUnsort.flat()];
      mergeRightUnsort = [];
      columns = [...mergeLeftSorted.flat(), ...mergeRightSorted.flat()];
      render();
      return;
    }
    mergeRightSorted = [
      ...mergeRightSorted,
      ...(mergeRightUnsort[0][0].value > mergeRightUnsort[1][0].value
        ? mergeRightUnsort[1].splice(0, 1)
        : mergeRightUnsort[0].splice(0, 1)),
    ];
    mergeRightSorted = mergeRightSorted.flat();
    columns = [
      ...mergeLeftSorted.flat(),
      ...mergeRightSorted.flat(),
      ...mergeRightUnsort.flat(),
    ];
    render();
    return;
  }

  // mergeLeftSorted and mergeRightSorted are being merge sorted into final array
  if ((mergeLeftSorted.length === 0) & (mergeRightSorted.length === 0)) {
    leftRightDivided = false;
    mergeLeftUnsort = [];
    mergeLeftSorted = [];
    mergeRightUnsort = [];
    mergeRightSorted = [];
    mergeTemp = [];
    console.log("Columns are sorted");
    renderIndicator("Sorting is finished. Randomize and sort again :)");
    clearInterval(interval);
    return;
  }

  if (mergeLeftSorted.length > 0 && mergeRightSorted.length > 0) {
    mergeTemp.push(
      mergeLeftSorted[0].value > mergeRightSorted[0].value
        ? mergeRightSorted.shift()
        : mergeLeftSorted.shift()
    );
    columns = [...mergeTemp, ...mergeLeftSorted, ...mergeRightSorted];
    render();
    return;
  }

  if (mergeLeftSorted.length) {
    mergeTemp.push(mergeLeftSorted.shift());
    columns = [...mergeTemp, ...mergeLeftSorted, ...mergeRightSorted];
    render();
    return;
  }

  if (mergeRightSorted.length) {
    mergeTemp.push(mergeRightSorted.shift());
    columns = [...mergeTemp, ...mergeLeftSorted, ...mergeRightSorted];
    render();
    return;
  }
}

//This function calls one step of the merge sort every given interval
function mergeSort() {
  // Safety in case someone spawn zero or only one element and then attempt to sort it.
  if (columns.length <= 1) {
    renderIndicator("There is not enough columns to sort. Spawn more :)");
    clearInterval(interval);
    return;
  }
  renderIndicator("Sorting in progress...");
  interval = setInterval(function () {
    mergeSortStep();
  }, 500);
}
