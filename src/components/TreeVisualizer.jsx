import React, { useState, useEffect, useRef } from 'react';
import '../css/TreeVisualizer.css';

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.color = 'red';
    this.x = 0;
    this.y = 0;
    this.highlight = false;
  }
}

class BinaryTree {
  insert(node, value) {
    if (!node) return new TreeNode(value);
    // Use probability-based insertion for better visualization
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    
    if (leftHeight <= rightHeight) {
      node.left = this.insert(node.left, value);
    } else {
      node.right = this.insert(node.right, value);
    }
    return node;
  }

  deleteNode(node, value) {
    if (!node) return null;
    if (value === node.value) {
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      const temp = this.findMin(node.right);
      node.value = temp.value;
      node.right = this.deleteNode(node.right, temp.value);
    } else {
      node.left = this.deleteNode(node.left, value);
      node.right = this.deleteNode(node.right, value);
    }
    return node;
  }

  findMin(node) {
    while (node?.left) node = node.left;
    return node;
  }
  findMax(node) {
    while (node?.right) node = node.right;
    return node;
  }

  height(node) {
    if (!node) return 0;
    return Math.max(this.height(node.left), this.height(node.right)) + 1;
  }

  countNodes(node) {
    if (!node) return 0;
    return 1 + this.countNodes(node.left) + this.countNodes(node.right);
  }

  traverse(node, order, path = []) {
    if (!node) return path;
    if (order === 'preorder') path.push(node.value);
    this.traverse(node.left, order, path);
    if (order === 'inorder') path.push(node.value);
    this.traverse(node.right, order, path);
    if (order === 'postorder') path.push(node.value);
    return path;
  }
}

class BST extends BinaryTree {
  insert(node, value) {
    if (!node) return new TreeNode(value);
    if (value < node.value) node.left = this.insert(node.left, value);
    else node.right = this.insert(node.right, value);
    return node;
  }

  search(node, value) {
    if (!node || node.value === value) return node;
    return value < node.value ? this.search(node.left, value) : this.search(node.right, value);
  }

  findMax(node) {
    while (node?.right) node = node.right;
    return node;
  }

  findSuccessor(node, value) {
    let successor = null;
    while (node) {
      if (value < node.value) {
        successor = node;
        node = node.left;
      } else node = node.right;
    }
    return successor;
  }

  findPredecessor(node, value) {
    let predecessor = null;
    while (node) {
      if (value > node.value) {
        predecessor = node;
        node = node.right;
      } else node = node.left;
    }
    return predecessor;
  }
}

class AVLTree extends BST {
  insert(node, value) {
    if (!node) return new TreeNode(value);
    if (value < node.value) node.left = this.insert(node.left, value);
    else node.right = this.insert(node.right, value);

    node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;
    return this.balance(node);
  }

  balance(node) {
    const balanceFactor = this.height(node.left) - this.height(node.right);
    if (balanceFactor > 1) {
      if (this.height(node.left.left) >= this.height(node.left.right)) return this.rotateRight(node);
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (balanceFactor < -1) {
      if (this.height(node.right.right) >= this.height(node.right.left)) return this.rotateLeft(node);
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    return node;
  }

  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    return y;
  }

  getBalanceFactor(node, value) {
    if (!node) return null;
    if (value < node.value) return this.getBalanceFactor(node.left, value);
    if (value > node.value) return this.getBalanceFactor(node.right, value);
    return this.height(node.left) - this.height(node.right);
  }
}

class RedBlackTree extends BST {
  // Red-Black Tree implementation
  constructor() {
    super();
    this.root = null;
  }
  rotateLeft(node) {
    const temp = node.right;
    node.right = temp.left;
    temp.left = node;
    temp.color = node.color;
    node.color = 'red';
    return temp;
  }

  rotateRight(node) {
    const temp = node.left;
    node.left = temp.right;
    temp.right = node;
    temp.color = node.color;
    node.color = 'red';
    return temp;
  }

  flipColors(node) {
    if (!node) return;
    node.color = node.color === 'red' ? 'black' : 'red';
    if (node.left) node.left.color = 'black';
    if (node.right) node.right.color = 'black';
  }

  isRed(node) {
    return node?.color === 'red';
  }

  insert(node, value) {
    if (!node) return new TreeNode(value);

    if (value < node.value) {
      node.left = this.insert(node.left, value);
    } else if (value > node.value) {
      node.right = this.insert(node.right, value);
    }

    // Fix RB properties
    if (this.isRed(node.right) && !this.isRed(node.left)) {
      node = this.rotateLeft(node);
    }
    if (this.isRed(node.left) && this.isRed(node.left.left)) {
      node = this.rotateRight(node);
    }
    if (this.isRed(node.left) && this.isRed(node.right)) {
      this.flipColors(node);
    }
    if (node === this.root) {
      node.color = 'black';
    }

    return node;
  }
}

const TreeVisualizer = () => {
  const [tree, setTree] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedTreeType, setSelectedTreeType] = useState('BinaryTree');
  const [traversalPath, setTraversalPath] = useState([]);
  const containerRef = useRef(null);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [operationInput, setOperationInput] = useState('');

  const treeInstance = {
    BinaryTree: new BinaryTree(),
    BST: new BST(),
    AVLTree: new AVLTree(),
    RedBlackTree: new RedBlackTree()
  }[selectedTreeType];

  const treeOperations = {
    BinaryTree: [
      { label: 'Insert', action: 'insert', needsInput: true },
      { label: 'Delete Node', action: 'deleteNode', needsInput: true },
      { label: 'Find Min', action: 'findMin' },
      { label: 'Find Max', action: 'findMax' },
      { label: 'Tree Height', action: 'height' },
      { label: 'Count Nodes', action: 'countNodes' }
    ],
    BST: [
      { label: 'Insert', action: 'insert', needsInput: true },
      { label: 'Delete Node', action: 'deleteNode', needsInput: true },
      { label: 'Find Min', action: 'findMin' },
      { label: 'Find Max', action: 'findMax' },
      { label: 'Find Successor', action: 'findSuccessor', needsInput: true },
      { label: 'Find Predecessor', action: 'findPredecessor', needsInput: true }
    ],
    AVLTree: [
      { label: 'Insert', action: 'insert', needsInput: true },
      { label: 'Delete Node', action: 'deleteNode', needsInput: true },
      { label: 'Rotate Left', action: 'rotateLeft' },
      { label: 'Rotate Right', action: 'rotateRight' },
      { label: 'Balance Factor', action: 'getBalanceFactor', needsInput: true }
    ],
    RedBlackTree: [
      { label: 'Insert', action: 'insert', needsInput: true },
      { label: 'Delete Node', action: 'deleteNode', needsInput: true },
      { label: 'Check Color', action: 'isRed', needsInput: true },
      { label: 'Flip Colors', action: 'flipColors', needsInput: true }
    ]
  };

  const handleOperation = (action) => {
    try {
      let result;
      switch (action) {
        case 'findMin':
          result = treeInstance.findMin(tree)?.value;
          alert(`Minimum value: ${result}`);
          break;
        case 'deleteNode':
          setTree(treeInstance.deleteNode(tree, parseInt(operationInput)));
          break;
        case 'findMax':
          result = treeInstance.findMax(tree)?.value;
          alert(`Maximum value: ${result}`);
          break;
        case 'height':
          alert(`Tree height: ${treeInstance.height(tree)}`);
          break;
        case 'countNodes':
          alert(`Total nodes: ${treeInstance.countNodes(tree)}`);
          break;
        case 'findSuccessor':
          result = treeInstance.findSuccessor(tree, parseInt(operationInput))?.value;
          alert(`Successor: ${result || 'None'}`);
          break;
        case 'findPredecessor':
          result = treeInstance.findPredecessor(tree, parseInt(operationInput))?.value;
          alert(`Predecessor: ${result || 'None'}`);
          break;
        case 'rotateLeft':
          setTree(treeInstance.rotateLeft(tree));
          break;
        case 'rotateRight':
          setTree(treeInstance.rotateRight(tree));
          break;
        case 'getBalanceFactor':
          const factor = treeInstance.getBalanceFactor(tree, parseInt(operationInput));
          alert(`Balance Factor: ${factor}`);
          break;
        case 'flipColors': {
          const flipNode = findNode(tree, parseInt(operationInput));
          if (flipNode) {
            treeInstance.flipColors(flipNode);
            setTree({ ...tree });
          }
          break;
        }

        case 'isRed': {
          const colorNode = findNode(tree, parseInt(operationInput));
          alert(colorNode ? `Node is ${colorNode.color}` : 'Node not found');
          break;
        }
        default:
          if (operationInput) {
            setTree(treeInstance[action](tree, parseInt(operationInput)));
          }
      }
      setOperationInput('');
    } catch (error) {
      alert(error.message);
    }
  };

  // Add clear tree function
  const clearTree = () => {
    setTree(null);
    setTraversalPath([]);
    setInputValue('');
  };

  const traverse = async (order) => {
    if (!tree) return;

    try {
      const path = treeInstance.traverse(tree, order);
      setTraversalPath([]);
      const tempTree = JSON.parse(JSON.stringify(tree));

      for (const value of path) {
        const node = findNode(tempTree, value);
        if (node) {
          node.highlight = true;
          setTree(tempTree);
          await new Promise(resolve => setTimeout(resolve, 500));
          node.highlight = false;
          setTree(tempTree);
        }
      }
      setTraversalPath(path);
    } catch (error) {
      alert(`Traversal error: ${error.message}`);
    }
  };


  // Add findNode helper
  const findNode = (node, value) => {
    if (!node) return null;
    if (node.value === value) return node;
    return findNode(node.left, value) || findNode(node.right, value);
  };

  const resetNodePositions = (node) => {
    if (!node) return;
    node.x = 0;
    node.y = 0;
    resetNodePositions(node.left);
    resetNodePositions(node.right);
  };


  const buildTree = () => {
    if (!inputValue) return;

    const values = inputValue.split(',').map(v => parseInt(v.trim()));
    let newTree = null;
// Build tree from scratch to ensure proper structure
    values.forEach(value => {
      newTree = treeInstance.insert(newTree, value);
    });
// Reset and recompute layout
    resetNodePositions(newTree);
    setTree(JSON.parse(JSON.stringify(newTree))); // Force new object reference
  };

  // Add state for viewBox calculations
const [viewBox, setViewBox] = useState("0 0 1200 600");
const [minX, setMinX] = useState(0);
const [minY, setMinY] = useState(0);
const [maxX, setMaxX] = useState(0);
const [maxY, setMaxY] = useState(0);

// Modify computeLayout to track boundaries
const computeLayout = (node, x, y, dx, dy, depth = 0) => {
  if (!node) return;
  
  // Track min/max coordinates
  setMinX(prev => Math.min(prev, x));
  setMaxX(prev => Math.max(prev, x));
  setMinY(prev => Math.min(prev, y));
  setMaxY(prev => Math.max(prev, y));

  node.x = x;
  node.y = y;
  
  const horizontalSpacing = dx * Math.pow(0.65, depth);
  const verticalSpacing = dy * 1.5;
  
  computeLayout(node.left, x - horizontalSpacing, y + verticalSpacing, dx, dy, depth + 1);
  computeLayout(node.right, x + horizontalSpacing, y + verticalSpacing, dx, dy, depth + 1);
};

// Update useEffect to calculate viewBox
useEffect(() => {
  if (tree && containerRef.current) {
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    // Reset bounds
    setMinX(containerWidth/2);
    setMaxX(containerWidth/2);
    setMinY(30);
    setMaxY(30);

    resetNodePositions(tree);
    computeLayout(
      tree,
      containerWidth / 2,  // Start from center
      50,                  // Initial Y position
      containerWidth / 4,  // Reduced initial spread
      80                   // Vertical spacing
    );
    
     // Force re-render with new positions
     setTree(prev => {
      const newTree = JSON.parse(JSON.stringify(prev));
      return newTree;
    });
  }
}, [tree]);

  const renderTree = (node) => {
    if (!node) return null;
     // Check if node is within visible bounds
  const isVisible = node.x > -100 && node.x < containerRef.current?.offsetWidth + 100;

    return (
      <g key={`${node.value}-${node.x}-${node.y}`} style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
        {/* Parent-child connections */}
        {node.left && (
          <path
            d={`M ${node.x} ${node.y} L ${node.left.x} ${node.left.y}`}
            stroke="#4CAF50"
            strokeWidth="1.5"
            fill="none"
          />
        )}
        {node.right && (
          <path
            d={`M ${node.x} ${node.y} L ${node.right.x} ${node.right.y}`}
            stroke="#4CAF50"
            strokeWidth="1.5"
            fill="none"
          />
        )}

        {/* Node circle (reduced size) */}
        <circle
          cx={node.x}
          cy={node.y}
          r="14" // Reduced from 20
          fill={node.highlight ? '#FFC107' : node.color || '#4CAF50'}
        />

        {/* Node text */}
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="12" // Reduced from 14
          fontWeight="500"
        >
          {node.value}
        </text>

        {renderTree(node.left)}
        {renderTree(node.right)}
      </g>
    );
  };


  return (
    <div className="visualizer-container">
      {/* Left Section (2/3 width) - Tree Visualization */}
      <div className="tree-section">
        <h2>Tree Visualizer</h2>

        {/* Tree Type Selection */}
        <div className="tree-type-selector">
          <select onChange={(e) => setSelectedTreeType(e.target.value)}>
            {Object.keys(treeOperations).map((treeType) => (
              <option key={treeType} value={treeType}>
                {treeType.replace(/([A-Z])/g, ' $1').trim()}
              </option>
            ))}
          </select>
        </div>

        {/* Tree Construction Controls */}
        <div className="build-tree-section">
          <input
            type="text"
            placeholder="Enter comma-separated values"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={buildTree}>Build Tree</button>
          <button onClick={clearTree} style={{ backgroundColor: '#f44336' }}>
            Clear Tree
          </button>
        </div>

        {/* Operation Buttons */}
        <div className="operation-buttons">
          {treeOperations[selectedTreeType].map((op) => (
            <button
              key={op.action}
              onClick={() => op.needsInput ? setCurrentOperation(op) : handleOperation(op.action)}
            >
              {op.label}
            </button>
          ))}
        </div>

        {/* Operation Input */}
        {currentOperation?.needsInput && (
          <div className="operation-input">
            <input
              type="number"
              placeholder="Enter value"
              value={operationInput}
              onChange={(e) => setOperationInput(e.target.value)}
            />
            <button onClick={() => {
              handleOperation(currentOperation.action);
              setCurrentOperation(null);
            }}>Confirm</button>
          </div>
        )}

        {/* Tree Visualization Area */}
        <div className="tree-display" ref={containerRef}>
          <svg
            width="100%"
            height="100%"
            viewBox={`${minX - 50} ${minY - 50} ${maxX - minX + 100} ${maxY - minY + 100}`}
          >
            {tree && renderTree(tree)}
          </svg>
        </div>

      </div>

      {/* Right Section (1/3 width) - Traversal Controls */}
      <div className="traversal-section">
        <div className="traversal-controls">
          <h3>Tree Operations</h3>

          {/* Traversal Buttons */}
          <div className="traversal-buttons">
            <button onClick={() => traverse('preorder')}>Pre-Order</button>
            <button onClick={() => traverse('inorder')}>In-Order</button>
            <button onClick={() => traverse('postorder')}>Post-Order</button>
          </div>

          {/* Traversal Path Display */}
          <div className="traversal-path">
            <h4>Traversal Path:</h4>
            <div className="path-display">
              {traversalPath.join(' → ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TreeVisualizer;