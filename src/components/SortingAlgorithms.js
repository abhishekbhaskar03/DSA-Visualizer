// SortingAlgorithms.js
import { NUMBER_OF_ARRAY_BARS } from '../constants';

export class SortingAlgorithms {
  constructor(setStateCallback) {
    this.setState = setStateCallback;
    this.array = [];
    this.animations = [];
  }

  resetArray() {
    this.array = Array.from({ length: NUMBER_OF_ARRAY_BARS }, () => 
      this.randomIntFromInterval(50, 500)
    );
    this.animations = [];
    this.setState({
      array: [...this.array],
      comparisons: 0,
      swaps: 0,
      spaceUsage: 0,
      maxDepth: 0
    });
    return this.array;
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Merge Sort
  // Update the mergeSortHelper method
mergeSortHelper(array, startIdx, endIdx, auxiliaryArray, animations) {
    if (startIdx >= endIdx) return;
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    this.mergeSortHelper(auxiliaryArray, startIdx, middleIdx, array, animations);
    this.mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, array, animations);
    this.merge(array, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
  }
  
  // Update the mergeSort method
  mergeSort() {
    this.animations = [];
    const auxiliaryArray = [...this.array];
    this.setState({ spaceUsage: this.array.length });
    this.mergeSortHelper(this.array, 0, this.array.length - 1, auxiliaryArray, this.animations);
    return this.animations;
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
      animations.push([i, j, "compare"]);
      this.setState(prev => ({ comparisons: prev.comparisons + 1 }));
      
      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        animations.push([k, null, "swap", auxiliaryArray[i], null]);
        array[k] = auxiliaryArray[i];
        k++;
        i++;
      } else {
        animations.push([k, null, "swap", auxiliaryArray[j], null]);
        array[k] = auxiliaryArray[j];
        k++;
        j++;
      }
      this.setState(prev => ({ swaps: prev.swaps + 1 }));
    }

    while (i <= middleIdx) {
      animations.push([k, null, "swap", auxiliaryArray[i], null]);
      array[k] = auxiliaryArray[i];
      k++;
      i++;
      this.setState(prev => ({ swaps: prev.swaps + 1 }));
    }

    while (j <= endIdx) {
      animations.push([k, null, "swap", auxiliaryArray[j], null]);
      array[k] = auxiliaryArray[j];
      k++;
      j++;
      this.setState(prev => ({ swaps: prev.swaps + 1 }));
    }
  }
  // Quick Sort
  quickSort() {
    this.animations = [];
    const arrayCopy = [...this.array];
    this.quickSortHelper(arrayCopy, 0, arrayCopy.length - 1, 1);
    return this.animations;
  }

  quickSortHelper(array, low, high, depth) {
    if (low < high) {
      this.setState(prev => ({ maxDepth: Math.max(prev.maxDepth, depth) }));
      const pivotIndex = this.partition(array, low, high);
      this.quickSortHelper(array, low, pivotIndex - 1, depth + 1);
      this.quickSortHelper(array, pivotIndex + 1, high, depth + 1);
    }
  }

  partition(array, low, high) {
    const pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      this.animations.push([j, high, 'compare']);
      this.setState(prev => ({ comparisons: prev.comparisons + 1 }));
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        this.animations.push([i, j, 'swap', array[i], array[j]]);
        this.setState(prev => ({ swaps: prev.swaps + 1 }));
      }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    this.animations.push([i + 1, high, 'swap', array[i + 1], array[high]]);
    this.setState(prev => ({ swaps: prev.swaps + 1 }));
    return i + 1;
  }

  // Heap Sort
  heapSort() {
    this.animations = [];
    const arrayCopy = [...this.array];
    this.setState({ spaceUsage: 1 });
    this.heapSortHelper(arrayCopy);
    return this.animations;
  }

  heapSortHelper(array) {
    const n = array.length;
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapify(array, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      this.animations.push([0, i, 'swap', array[i], array[0]]);
      [array[0], array[i]] = [array[i], array[0]];
      this.setState(prev => ({ swaps: prev.swaps + 1 }));
      this.heapify(array, i, 0);
    }
  }

  heapify(array, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      this.animations.push([i, left, 'compare']);
      this.setState(prev => ({ comparisons: prev.comparisons + 1 }));
      if (array[left] > array[largest]) largest = left;
    }

    if (right < n) {
      this.animations.push([i, right, 'compare']);
      this.setState(prev => ({ comparisons: prev.comparisons + 1 }));
      if (array[right] > array[largest]) largest = right;
    }

    if (largest !== i) {
      this.animations.push([i, largest, 'swap', array[largest], array[i]]);
      [array[i], array[largest]] = [array[largest], array[i]];
      this.setState(prev => ({ swaps: prev.swaps + 1 }));
      this.heapify(array, n, largest);
    }
  }

  // Bubble Sort
  bubbleSort() {
    this.animations = [];
    const arrayCopy = [...this.array];
    this.setState({ spaceUsage: 1 });
    
    for (let i = 0; i < arrayCopy.length - 1; i++) {
      for (let j = 0; j < arrayCopy.length - 1 - i; j++) {
        this.animations.push([j, j + 1, 'compare']);
        this.setState(prev => ({ comparisons: prev.comparisons + 1 }));
        
        if (arrayCopy[j] > arrayCopy[j + 1]) {
          this.animations.push([j, j + 1, 'swap', arrayCopy[j + 1], arrayCopy[j]]);
          [arrayCopy[j], arrayCopy[j + 1]] = [arrayCopy[j + 1], arrayCopy[j]];
          this.setState(prev => ({ swaps: prev.swaps + 1 }));
        }
      }
    }
    return this.animations;
  }
}