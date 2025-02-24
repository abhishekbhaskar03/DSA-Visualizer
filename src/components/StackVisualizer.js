import React from 'react';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../constants';
import '../css/LinkedListCommon.css';

class Stack {
  constructor(maxSize = 10) {
    this.items = [];
    this.maxSize = maxSize;
  }

  push(value) {
    if (this.isFull()) return false;
    this.items.push(value);
    return true;
  }

  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  isFull() {
    return this.items.length === this.maxSize;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }

  search(value) {
    return this.items.includes(value);
  }

  reverse() {
    this.items.reverse();
  }

  display() {
    return [...this.items];
  }
}

const StackElement = ({ value, isHighlighted }) => (
  <div
    className="linked-list-node"
    style={{ backgroundColor: isHighlighted ? SECONDARY_COLOR : PRIMARY_COLOR }}
  >
    <div className="node-value">{value}</div>
  </div>
);

export default class StackVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stack: new Stack(), 
      inputValue: '',
      highlightedIndex: null,
    };
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  pushElement = () => {
    const { stack, inputValue } = this.state;
    if (inputValue) {
      const success = stack.push(parseInt(inputValue));
      if (success) {
        this.setState({ stack, inputValue: '', highlightedIndex: stack.size() - 1 });
        setTimeout(() => this.setState({ highlightedIndex: null }), 1000);
      } else {
        alert('Stack is full!');
      }
    }
  };

  popElement = () => {
    const { stack } = this.state;
    if (stack.isEmpty()) {
      alert('Stack is empty!');
    } else {
      stack.pop();
      this.setState({ stack });
    }
  };

  peekElement = () => {
    const { stack } = this.state;
    const topElement = stack.peek();
    if (topElement !== null) {
      this.setState({ highlightedIndex: stack.size() - 1 });
      setTimeout(() => this.setState({ highlightedIndex: null }), 1000);
    } else {
      alert('Stack is empty!');
    }
  };

  checkEmpty = () => {
    const { stack } = this.state;
    alert(stack.isEmpty() ? 'Stack is empty!' : 'Stack is not empty.');
  };

  checkFull = () => {
    const { stack } = this.state;
    alert(stack.isFull() ? 'Stack is full!' : 'Stack is not full.');
  };

  clearStack = () => {
    const { stack } = this.state;
    stack.clear();
    this.setState({ stack });
  };

  searchElement = () => {
    const { stack, inputValue } = this.state;
    if (inputValue) {
      const value = parseInt(inputValue);
      const found = stack.search(value);
      if (found) {
        alert(`Element ${value} found in stack!`);
      } else {
        alert(`Element ${value} not found in stack.`);
      }
    }
  };

  reverseStack = () => {
    const { stack } = this.state;
    stack.reverse();
    this.setState({ stack });
  };

  generateNewStack = () => {
    const newStack = new Stack(15);
    for (let i = 0; i < 8 ; i++) {
      newStack.push(Math.floor(Math.random() * 100) + 1); // Random numbers between 1 and 100
    }
    this.setState({ stack: newStack });
  };

  render() {
    const { stack, inputValue, highlightedIndex } = this.state;
    const stackElements = stack.display();

    return (
      <div className="linked-list-container">
        <h1>Stack Visualizer</h1>

        {/* Generate New Stack Button */}
        <div className="generate-button-container">
          <button onClick={this.generateNewStack}>Generate New Stack</button>
        </div>

        {/* Basic Operations */}
        <div className="controls-container">
          <div className="control-group">
            <button onClick={this.popElement}>Pop</button>
          </div>
          <div className="control-group">
            <button onClick={this.peekElement}>Peek</button>
          </div>
          <div className="control-group">
            <button onClick={this.checkEmpty}>Is Empty?</button>
          </div>
          <div className="control-group">
            <button onClick={this.checkFull}>Is Full?</button>
          </div>
        </div>

        {/* Additional Operations */}
        <div className="controls-container">
          <div className="control-group">
            <button onClick={this.clearStack}>Clear</button>
          </div>
          <div className="control-group">
            <button onClick={this.searchElement}>Search</button>
          </div>
          <div className="control-group">
            <button onClick={this.reverseStack}>Reverse</button>
          </div>
          <div className="control-group">
            <button disabled>Size: {stack.size()}</button>
          </div>
        </div>

        {/* User Input for Push */}
        <div className="controls-container">
          <div className="control-group">
            <input
              type="number"
              placeholder="Enter value"
              value={inputValue}
              onChange={this.handleInputChange}
            />
            <button onClick={this.pushElement}>Push</button>
          </div>
        </div>

        {/* Stack Visualization */}
        <div className="stack-container">
          {stackElements.map((value, index) => (
            <div key={index} className="linked-list-node-container">
              <StackElement
                value={value}
                isHighlighted={highlightedIndex === index}
              />
            </div>
          ))}
        </div>

        
      </div>
    );
  }
}