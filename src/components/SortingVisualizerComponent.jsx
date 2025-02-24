// SortingVisualizerComponent.jsx
import React from 'react';
import { SortingAlgorithms } from './SortingAlgorithms';
import { PRIMARY_COLOR, SECONDARY_COLOR, ANIMATION_SPEED_MS } from '../constants';
import '../css/SortingVisualizer.css';

const ArrayBar = ({ value}) => (
    <div
      className="array-bar"
      style={{
        backgroundColor: 'lightgreen',
        height: `${value}px`,
        position: 'relative',
      }}
    >
      <span
        className="array-bar-value"
        style={{
          position: 'absolute',
          top: '-25px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'red',
        }}
      >
        {value}
      </span>
    </div>
  );

  
export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
      algorithm: null,
      comparisons: 0,
      swaps: 0,
      isSorting: false,
      spaceUsage: 0,
      maxDepth: 0
    };
    this.sortingAlgo = new SortingAlgorithms(this.setState.bind(this));
  }

  componentDidMount() {
    this.sortingAlgo.resetArray();
  }

  animateSort(animations) {
    const arrayBars = document.getElementsByClassName('array-bar');
    animations.forEach(([idx1, idx2, type, newValue1, newValue2], i) => {
      setTimeout(() => {
        if (type === 'compare') {
          arrayBars[idx1].style.backgroundColor = SECONDARY_COLOR;
          arrayBars[idx2].style.backgroundColor = SECONDARY_COLOR;
        } else if (type === 'swap') {
          if (newValue1 !== undefined) {
            arrayBars[idx1].style.height = `${newValue1}px`;
            arrayBars[idx1].querySelector('.array-bar-value').textContent = newValue1;
          }
          if (newValue2 !== undefined && idx2 !== null) {
            arrayBars[idx2].style.height = `${newValue2}px`;
            arrayBars[idx2].querySelector('.array-bar-value').textContent = newValue2;
          }
        }
        // Reset color after a delay
        setTimeout(() => {
          arrayBars[idx1].style.backgroundColor = PRIMARY_COLOR;
          if (idx2 !== null) arrayBars[idx2].style.backgroundColor = PRIMARY_COLOR;
          // Final callback
          if (i === animations.length - 1) {
            setTimeout(() => {
              this.setState({ isSorting: false });
            }, ANIMATION_SPEED_MS);
          }
        }, ANIMATION_SPEED_MS);
      }, i * ANIMATION_SPEED_MS);
    });
  }

  handleSort(algorithm) {
    this.setState({ isSorting: true, algorithm });
    const animations = this.sortingAlgo[`${algorithm}Sort`]();
    this.animateSort(animations);
    }

   
calculateComplexity(algorithm) {
    const {maxDepth } = this.state;
    
  
    const complexities = {
      merge: {
        time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
        space: 'O(n)'
      },
      quick: {
        time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
        space: `O(log n) ${maxDepth > 0 ? `(Depth: ${maxDepth})` : ''}`
      },
      heap: {
        time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
        space: 'O(1)'
      },
      bubble: {
        time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
        space: 'O(1)'
      }
    };
  
    return complexities[algorithm] || {};
  }
 

  render() {
    const { array, isSorting, algorithm, comparisons, swaps, spaceUsage, maxDepth } = this.state;
    const complexity = this.calculateComplexity(algorithm);

    return (
      <div className="sorting-visualizer">
        <div className="controls">
          <button onClick={() => this.sortingAlgo.resetArray()} disabled={isSorting}>
            Generate New Array
          </button>
          {['merge', 'quick', 'heap', 'bubble'].map(algo => (
            <button key={algo} onClick={() => this.handleSort(algo)} disabled={isSorting}>
              {algo.charAt(0).toUpperCase() + algo.slice(1)} Sort
            </button>
          ))}
        </div>
        
        <div className="visualization-container">
          <div className="array-container">
            {array.map((value, idx) => (
              <ArrayBar key={idx} value={value} />
            ))}
          </div>

          <div className="complexity-panel">
            <h3>Algorithm Complexity</h3>
            {algorithm && (
              <>
                <div className="complexity-section">
                  <h4>Time Complexity</h4>
                  <p>Best Case: {complexity.time.best}</p>
                  <p>Average Case: {complexity.time.average}</p>
                  <p>Worst Case: {complexity.time.worst}</p>
                </div>
                
                <div className="complexity-section">
                  <h4>Space Complexity</h4>
                  <p>{complexity.space}</p>
                </div>

                <div className="stats-section">
                  <h4>Current Run Statistics</h4>
                  <p>Comparisons: {comparisons}</p>
                  <p>Swaps: {swaps}</p>
                  {algorithm === 'quick' && <p>Maximum Recursion Depth: {maxDepth}</p>}
                  <p>Space Used: {spaceUsage} units</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}