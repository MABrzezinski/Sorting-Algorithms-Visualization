# Sorting-Algorithms-Visualization
Simple page that shows how few of the most popular sorting algorithms work </br>
👉 See it at https://brzezinskimichal.pl/prjcts/SAV/ </br>
🤓 Read about the project at https://brzezinskimichal.pl/sorting-algorithms-visualization/

Using:
  * Pure JS
  * Charts.css (https://chartscss.org) for columns styling
  * Skeleton (http://getskeleton.com) as a css framework
  * HTML5 Boilerplate (https://html5boilerplate.com)

LOG
--------
Ver 0.5
  * Fix bugs with buttons visual indications. Change logic so its not relaying on eventlistener.
  * Take out JS markup from html.
  * Refactor bubble sort code, so its not relying on noSwaps for checking if columns are sorted and it checks if sorted every step.
  * Refactor selection sort code the same way as bubble sort.
  * Refactor heap sort code. Add code that every step checks if array is sorted.
  * Refactor merge sort code. Take out checking if column array has more than 8 elements outside step function. Add code that every step checks if array is sorted.

Ver 0.36
  * Blocks buttons when sorting is in process and gives them visual indication

Ver 0.33
  * Fixed problem with 0-elements or 1-element column array
 
Ver 0.3 
  * Visualization of merge sort for maximum of 8 elements

Ver 0.2
  * Visualization of heap sort

Ver 0.15
  * Log showing messages about current state of sorting

Ver 0.1
  * Spawn columns with random values
  * Randomize spawned columns
  * Visualization of insertion sort, bubble sort and selection sort
