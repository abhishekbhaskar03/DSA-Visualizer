import React from 'react';
import { ANIMATION_SPEED_MS, PRIMARY_COLOR, SECONDARY_COLOR, NUMBER_OF_ARRAY_BARS } from './src/constants';
import '../css/SortingVisualizer.css';

const ArrayBar = ({ value, primaryColor }) => (
  <div
    className="array-bar"
    style={{
      backgroundColor: primaryColor,
      height: `${value}px`,
      position: 'relative',
    }}
  >
    <span
      style={{
        position: 'absolute',
        top: '-20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'red',
      }}
    >
      {value}
    </span>
  </div>
);

const animateArrayBars = (animations, speed, arrayBars, primaryColor, secondaryColor, callback) => {
  for (let i = 0; i < animations.length; i++) {
    const [barOneIdx, barTwoIdx, type, newValueOne, newValueTwo] = animations[i];
    setTimeout(() => {
      if (type === "compare") {
        arrayBars[barOneIdx].style.backgroundColor = secondaryColor;
        if (barTwoIdx !== null) arrayBars[barTwoIdx].style.backgroundColor = secondaryColor;
      } else if (type === "swap") {
        arrayBars[barOneIdx].style.height = `${newValueOne}px`;
        arrayBars[barOneIdx].querySelector('span').textContent = newValueOne;
        if (barTwoIdx !== null) {
          arrayBars[barTwoIdx].style.height = `${newValueTwo}px`;
          arrayBars[barTwoIdx].querySelector('span').textContent = newValueTwo;
        }
      }
      setTimeout(() => {
        if (type === "compare") {
          arrayBars[barOneIdx].style.backgroundColor = primaryColor;
          if (barTwoIdx !== null) arrayBars[barTwoIdx].style.backgroundColor = primaryColor;
        }
        if (i === animations.length - 1) callback();
      }, speed);
    }, i * speed);
  }
};

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
      isSorting: false,
      selectedAlgorithm: null,
      comparisons: 0,
      swaps: 0,
      spaceUsage: 0,
      maxDepth: 0, // For tracking Quick Sort recursion depth
    };
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    const array = Array.from({ length: NUMBER_OF_ARRAY_BARS }, () => randomIntFromInterval(5, 500));
    this.setState({ array, selectedAlgorithm: null, comparisons: 0, swaps: 0, spaceUsage: 0, maxDepth: 0 });
  }

  sort(algorithm) {
    if (this.state.isSorting) return;
    this.setState({ isSorting: true, selectedAlgorithm: algorithm, comparisons: 0, swaps: 0, spaceUsage: 0, maxDepth: 0 });

    const array = [...this.state.array];
    const animations = [];

    switch (algorithm) {
      case "merge":
        this.mergeSortHelper(array, animations);
        break;
      case "quick":
        this.quickSortHelper(array, 0, array.length - 1, animations, 1);
        break;
      case "heap":
        this.heapSortHelper(array, animations);
        break;
      case "bubble":
        this.bubbleSortHelper(array, animations);
        break;
      default:
        break;
    }

    setTimeout(() => {
      const arrayBars = document.getElementsByClassName('array-bar');
      animateArrayBars(animations, ANIMATION_SPEED_MS, arrayBars, PRIMARY_COLOR, SECONDARY_COLOR, () => {
        this.setState({ isSorting: false });
      });
    }, 50);
  }

  // Merge Sort
  mergeSortHelper(array, animations) {
    if (array.length <= 1) return;
    const auxiliaryArray = array.slice();
    this.setState({ spaceUsage: array.length }); // Track auxiliary space
    this.mergeSortMain(array, 0, array.length - 1, auxiliaryArray, animations);
  }

  mergeSortMain(array, startIdx, endIdx, auxiliaryArray, animations) {
    if (startIdx === endIdx) return;
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    this.mergeSortMain(auxiliaryArray, startIdx, middleIdx, array, animations);
    this.mergeSortMain(auxiliaryArray, middleIdx + 1, endIdx, array, animations);
    this.merge(array, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
  }

  merge(array, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;

    while (i <= middleIdx && j <= endIdx) {
      animations.push([i, j, "compare", null, null]);
      this.setState((prev) => ({ comparisons: prev.comparisons + 1 }));
      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        animations.push([k, null, "swap", auxiliaryArray[i], null]);
        array[k++] = auxiliaryArray[i++];
      } else {
        animations.push([k, null, "swap", auxiliaryArray[j], null]);
        array[k++] = auxiliaryArray[j++];
      }
      this.setState((prev) => ({ swaps: prev.swaps + 1 }));
    }

    while (i <= middleIdx) {
      animations.push([k, null, "swap", auxiliaryArray[i], null]);
      array[k++] = auxiliaryArray[i++];
      this.setState((prev) => ({ swaps: prev.swaps + 1 }));
    }

    while (j <= endIdx) {
      animations.push([k, null, "swap", auxiliaryArray[j], null]);
      array[k++] = auxiliaryArray[j++];
      this.setState((prev) => ({ swaps: prev.swaps + 1 }));
    }
  }

  // Quick Sort
  quickSortHelper(array, low, high, animations, depth) {
    if (low < high) {
      this.setState((prev) => ({ maxDepth: Math.max(prev.maxDepth, depth) }));
      const pivotIndex = this.partition(array, low, high, animations);
      this.quickSortHelper(array, low, pivotIndex - 1, animations, depth + 1);
      this.quickSortHelper(array, pivotIndex + 1, high, animations, depth + 1);
    }
  }

  partition(array, low, high, animations) {
    const pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      animations.push([j, high, "compare", null, null]);
      this.setState((prev) => ({ comparisons: prev.comparisons + 1 }));
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        animations.push([i, j, "swap", array[i], array[j]]);
        this.setState((prev) => ({ swaps: prev.swaps + 1 }));
      }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    animations.push([i + 1, high, "swap", array[i + 1], array[high]]);
    this.setState((prev) => ({ swaps: prev.swaps + 1 }));
    return i + 1;
  }

  // Heap Sort
  heapSortHelper(array, animations) {
    const n = array.length;
    this.setState({ spaceUsage: 1 }); // In-place algorithm
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapify(array, n, i, animations);
    }
    for (let i = n - 1; i > 0; i--) {
      animations.push([0, i, "swap", array[i], array[0]]);
      [array[0], array[i]] = [array[i], array[0]];
      this.setState((prev) => ({ swaps: prev.swaps + 1 }));
      this.heapify(array, i, 0, animations);
    }
  }

  heapify(array, n, i, animations) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      animations.push([i, left, "compare", null, null]);
      this.setState((prev) => ({ comparisons: prev.comparisons + 1 }));
      if (array[left] > array[largest]) largest = left;
    }

    if (right < n) {
      animations.push([i, right, "compare", null, null]);
      this.setState((prev) => ({ comparisons: prev.comparisons + 1 }));
      if (array[right] > array[largest]) largest = right;
    }

    if (largest !== i) {
      animations.push([i, largest, "swap", array[largest], array[i]]);
      [array[i], array[largest]] = [array[largest], array[i]];
      this.setState((prev) => ({ swaps: prev.swaps + 1 }));
      this.heapify(array, n, largest, animations);
    }
  }

  // Bubble Sort
  bubbleSortHelper(array, animations) {
    this.setState({ spaceUsage: 1 }); // In-place algorithm
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - 1 - i; j++) {
        animations.push([j, j + 1, "compare", null, null]);
        this.setState((prev) => ({ comparisons: prev.comparisons + 1 }));
        if (array[j] > array[j + 1]) {
          animations.push([j, j + 1, "swap", array[j + 1], array[j]]);
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          this.setState((prev) => ({ swaps: prev.swaps + 1 }));
        }
      }
    }
  }

  // Calculate Time Complexity
  calculateTimeComplexity(algorithm, comparisons, swaps, n) {
    const totalOps = comparisons + swaps; // Total operations (comparisons + swaps)
    const logN = Math.log2(n);           // log2(n) for logarithmic calculations
    const nLogN = n * logN;              // Theoretical O(n log n)
    const nSquared = n * n;              // Theoretical O(n²)
  
    switch (algorithm) {
      case "merge":
        // Merge Sort is always O(n log n)
        return `O(n log n) (Actual Operations: ${totalOps})`;
      case "quick":
        // Quick Sort: Determine if it's best/average or worst case
        if (totalOps <= 2 * nLogN) {
          return `O(n log n) (Best/Average Case, Actual Operations: ${totalOps})`;
        } else if (totalOps >= 0.5 * nSquared) {
          return `O(n²) (Worst Case, Actual Operations: ${totalOps})`;
        } else {
          return `O(n log n) (Average Case, Actual Operations: ${totalOps})`;
        }
      case "heap":
        // Heap Sort is always O(n log n)
        return `O(n log n) (Actual Operations: ${totalOps})`;
      case "bubble":
        // Bubble Sort: Determine if it's best or worst case
        if (swaps === 0) {
          return `O(n) (Best Case, Actual Operations: ${totalOps})`;
        } else if (totalOps >= 0.5 * nSquared) {
          return `O(n²) (Worst Case, Actual Operations: ${totalOps})`;
        } else {
          return `O(n²) (Average Case, Actual Operations: ${totalOps})`;
        }
      default:
        return "";
    }
  }

  render() {
    const { array, isSorting, selectedAlgorithm, comparisons, swaps, spaceUsage, maxDepth } = this.state;
    const n = array.length;
    const timeComplexity = this.calculateTimeComplexity(selectedAlgorithm, comparisons, swaps, n);
    let displayedSpace = spaceUsage;
    if (selectedAlgorithm === "quick") displayedSpace = maxDepth;

    return (
      <div className="array-container">
        <h1>DSA VISUALIZER</h1>
        <h3>Data Structures and Algorithms</h3>
        <div className="content-container">
          <p>
            An interactive application called the DSA Visualizer was created to make studying and comprehending data structures and algorithms easier. It provides a user-friendly, aesthetically appealing environment for investigating intricate ideas such as arrays, linked lists, trees, graphs, sorting, and searching algorithms. This tool fills the gap between theoretical understanding and real-world application by offering detailed visual representations of how algorithms work and modify data structures. Whether you are a novice looking to establish a strong foundation or an experienced student looking to improve your comprehension, the DSA Visualizer makes learning DSA principles more approachable, engaging, and enjoyable.
          </p>
          <img src="https://miro.medium.com/v2/resize:fit:1024/1*lGUL34nZvS3gXv4LNAKG3Q.jpeg" alt="Description" className="right-image" />
        </div>
        <div>
          <h3>Sorting Algorithms</h3>
          <div className="button-container">
            <button onClick={() => this.resetArray()} disabled={isSorting}>Generate New Array</button>
            <button onClick={() => this.sort("merge")} disabled={isSorting}>Merge Sort</button>
            <button onClick={() => this.sort("quick")} disabled={isSorting}>Quick Sort</button>
            <button onClick={() => this.sort("heap")} disabled={isSorting}>Heap Sort</button>
            <button onClick={() => this.sort("bubble")} disabled={isSorting}>Bubble Sort</button>
          </div>
        </div>
        <div className="sorting-container">
          <div className="array-bars-container">
            {array.map((value, idx) => (
              <ArrayBar key={idx} value={value} primaryColor={PRIMARY_COLOR} />
            ))}
          </div>
          <div className="complexity-container">
            <h3>Complexities</h3>
            {selectedAlgorithm && (
              <div>
                <h4>Time Complexity</h4>
            <p><strong>Comparisons:</strong> {comparisons}</p>
            <p><strong>Swaps:</strong> {swaps}</p>
            <p><strong>Case-Specific Time Complexity:</strong> {timeComplexity}</p>
            <h4>Space Complexity</h4>
            <p><strong>Space Usage:</strong> {displayedSpace} units</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}