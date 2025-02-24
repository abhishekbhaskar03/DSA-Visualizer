import React from 'react';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../constants';
import '../css/LinkedListCommon.css';

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null; // Added previous pointer for doubly linked list
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null; // Added tail for doubly linked list
    this.size = 0;
  }

  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  insertAt(value, index) {
    if (index < 0 || index > this.size) return false;
    const newNode = new Node(value);
    if (index === 0) {
      newNode.next = this.head;
      if (this.head) this.head.prev = newNode;
      this.head = newNode;
      if (!this.tail) this.tail = newNode;
    } else if (index === this.size) {
      this.append(value);
    } else {
      let current = this.head;
      for (let i = 0; i < index - 1; i++) {
        current = current.next;
      }
      newNode.next = current.next;
      newNode.prev = current;
      current.next.prev = newNode;
      current.next = newNode;
    }
    this.size++;
    return true;
  }

  removeAt(index) {
    if (index < 0 || index >= this.size) return null;
    let removedNode;
    if (index === 0) {
      removedNode = this.head;
      this.head = this.head.next;
      if (this.head) this.head.prev = null;
      if (!this.head) this.tail = null;
    } else if (index === this.size - 1) {
      removedNode = this.tail;
      this.tail = this.tail.prev;
      this.tail.next = null;
    } else {
      let current = this.head;
      for (let i = 0; i < index; i++) {
        current = current.next;
      }
      removedNode = current;
      current.prev.next = current.next;
      current.next.prev = current.prev;
    }
    this.size--;
    return removedNode.value;
  }

  traverse() {
    const values = [];
    let current = this.head;
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    return values;
  }
}

const DoublyLinkedListNode = ({ value, isNew, isHighlighted }) => (
  <div
    className={`linked-list-node ${isNew ? 'new-node' : ''}`}
    style={{ backgroundColor: isHighlighted ? SECONDARY_COLOR : PRIMARY_COLOR }}
  >
    <div className="node-value">{value}</div>
  </div>
);

export default class DoublyLinkedListVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      linkedList: new DoublyLinkedList(),
      inputValue: '',
      insertIndex: '',
      removeIndex: '',
      newNodes: [],
      highlightedNode: null,
    };
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInsertIndexChange = (e) => {
    this.setState({ insertIndex: e.target.value });
  };

  handleRemoveIndexChange = (e) => {
    this.setState({ removeIndex: e.target.value });
  };

  appendNode = () => {
    const { linkedList, inputValue } = this.state;
    if (inputValue) {
      linkedList.append(parseInt(inputValue));
      this.setState({ linkedList, inputValue: '', newNodes: [linkedList.size - 1] });
      setTimeout(() => this.setState({ newNodes: [] }), 1000);
    }
  };

  insertNode = () => {
    const { linkedList, inputValue, insertIndex } = this.state;
    if (inputValue && insertIndex !== '') {
      linkedList.insertAt(parseInt(inputValue), parseInt(insertIndex));
      this.setState({
        linkedList,
        inputValue: '',
        insertIndex: '',
        newNodes: [parseInt(insertIndex)],
        highlightedNode: parseInt(insertIndex),
      });
      setTimeout(() => this.setState({ newNodes: [], highlightedNode: null }), 1000);
    }
  };

  removeNode = () => {
    const { linkedList, removeIndex } = this.state;
    if (removeIndex !== '') {
      this.setState({ highlightedNode: parseInt(removeIndex) });
      setTimeout(() => {
        linkedList.removeAt(parseInt(removeIndex));
        this.setState({ linkedList, removeIndex: '', highlightedNode: null });
      }, 500);
    }
  };

  generateRandomLinkedList = () => {
    const linkedList = new DoublyLinkedList();
    const numberOfNodes = 10;
    for (let i = 0; i < numberOfNodes; i++) {
      linkedList.append(Math.floor(Math.random() * 100) + 1);
    }
    this.setState({ linkedList });
  };

  render() {
    const { linkedList, inputValue, insertIndex, removeIndex, newNodes, highlightedNode } = this.state;
    const values = linkedList.traverse();

    return (
      <div className="linked-list-container">
        <h1>Doubly Linked List Visualizer</h1>

        {/* Generate Random List Button */}
        <div className="generate-button-container">
          <button onClick={this.generateRandomLinkedList}>
            Generate Doubly Linked List
          </button>
        </div>

        {/* Control Groups */}
        <div className="controls-container">
          {/* Append */}
          <div className="control-group">
            <input
              type="number"
              placeholder="Enter value"
              value={inputValue}
              onChange={this.handleInputChange}
            />
            <button onClick={this.appendNode}>Append</button>
          </div>

          {/* Insert */}
          <div className="control-group">
            <input
              type="number"
              placeholder="Index"
              value={insertIndex}
              onChange={this.handleInsertIndexChange}
            />
            <button onClick={this.insertNode}>Insert At</button>
          </div>

          {/* Remove */}
          <div className="control-group">
            <input
              type="number"
              placeholder="Index"
              value={removeIndex}
              onChange={this.handleRemoveIndexChange}
            />
            <button onClick={this.removeNode}>Remove At</button>
          </div>
        </div>

        {/* Linked List Visualization */}
        <div className="linked-list">
          {values.map((value, index) => (
            <div key={index} className="linked-list-node-container">
              <DoublyLinkedListNode
                value={value}
                isNew={newNodes.includes(index)}
                isHighlighted={highlightedNode === index}
              />
              {index !== values.length - 1 && <div className="arrow">↔</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }
}