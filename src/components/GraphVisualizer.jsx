// GraphVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../css/GraphVisualizer.css';

// =====================
// Graph Implementations
// =====================

class BaseGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Set();
  }

  clearGraph() {
    this.nodes.clear();
    this.edges.clear();
  }

  isEmpty() {
    return this.nodes.size === 0;
  }

  addNode(id) {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, {
        id,
        x: 0,
        y: 0,
        color: '#4CAF50',
        connections: new Set(),
        inEdges: new Set()
      });
    }
  }

  deleteNode(id) {
    if (!this.nodes.has(id)) return;

    const node = this.nodes.get(id);
    // Remove connected edges
    [...node.connections].forEach(target => this.deleteEdge(id, target));
    [...node.inEdges].forEach(source => this.deleteEdge(source, id));

    this.nodes.delete(id);
  }

  clone() {
    const NewGraph = this.constructor;
    const newGraph = new NewGraph();

    // Deep clone nodes
    newGraph.nodes = new Map();
    this.nodes.forEach((node, id) => {
      newGraph.nodes.set(id, {
        ...node,
        connections: new Set(node.connections),
        inEdges: new Set(node.inEdges)
      });
    });

    // Clone edges
    newGraph.edges = new Set(this.edges);

    return newGraph;
  }
}



class UndirectedGraph extends BaseGraph {
  addEdge(u, v) {
    if (u === v) throw new Error('Self-edges not allowed');
    if (this.edges.has(`${u}-${v}`)) throw new Error('Edge already exists');

    this.edges.add(`${u}-${v}`);
    this.edges.add(`${v}-${u}`);

    this.nodes.get(u).connections.add(v);
    this.nodes.get(v).connections.add(u);
  }

  deleteEdge(u, v) {
    this.edges.delete(`${u}-${v}`);
    this.edges.delete(`${v}-${u}`);

    this.nodes.get(u)?.connections.delete(v);
    this.nodes.get(v)?.connections.delete(u);
  }
  hasEdge(u, v) {
    return this.edges.has(`${u}-${v}`) || this.edges.has(`${v}-${u}`);
  }

  getNeighbors(id) {
    return [...this.nodes.get(id)?.connections || []];
  }

  hasCycle() {
    const visited = new Set();

    const dfs = (node, parent) => {
      visited.add(node);
      for (const neighbor of this.getNeighbors(node)) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor, node)) return true;
        } else if (neighbor !== parent) {
          return true;
        }
      }
      return false;
    };

    for (const node of this.nodes.keys()) {
      if (!visited.has(node) && dfs(node, null)) {
        return true;
      }
    }
    return false;
  }

  bfs(startId) {
    const visited = new Set();
    const result = [];
    const queue = [startId];

    if (!this.nodes.has(startId)) return result;

    visited.add(startId);
    result.push(startId);

    while (queue.length > 0) {
      const current = queue.shift();

      this.getNeighbors(current).forEach(neighbor => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          result.push(neighbor);
          queue.push(neighbor);
        }
      });
    }
    return result;
  }

  dfs(startId) {
    const visited = new Set();
    const result = [];

    if (!this.nodes.has(startId)) return result;

    const dfsHelper = (node) => {
      visited.add(node);
      result.push(node);

      this.getNeighbors(node).forEach(neighbor => {
        if (!visited.has(neighbor)) dfsHelper(neighbor);
      });
    };

    dfsHelper(startId);
    return result;
  }

  connectedComponents() {
    const visited = new Set();
    const components = [];

    for (const node of this.nodes.keys()) {
      if (!visited.has(node)) {
        const component = this.bfs(node);
        components.push(component);
        component.forEach(n => visited.add(n));
      }
    }
    return components;
  }
}

class DAG extends BaseGraph {
  addEdge(source, target) {
    if (source === target) throw new Error('Self-edges not allowed');
    if (this.edges.has(`${source}->${target}`)) throw new Error('Edge exists');
  
    // Check for cycles using parent traversal
    if (this.willCreateCycle(source, target)) {
      throw new Error('Edge creates cycle');
    }
  
    this.edges.add(`${source}->${target}`);
    this.nodes.get(source).connections.add(target);
    this.nodes.get(target).inEdges.add(source);
  }

  getEdgePath(sourceNode, targetNode) {
    const dx = targetNode.x - sourceNode.x;
    const dy = targetNode.y - sourceNode.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const offset = 20; // Node radius
    const adjustedX = dx * (1 - offset / length);
    const adjustedY = dy * (1 - offset / length);

    return `M0,0 L${adjustedX},${adjustedY}`;
  }

  deleteEdge(source, target) {
    this.edges.delete(`${source}->${target}`);
    this.nodes.get(source)?.connections.delete(target);
    this.nodes.get(target)?.inEdges.delete(source);
  }

  getParents(id) {
    return [...this.nodes.get(id)?.inEdges || []];
  }

  getChildren(id) {
    return [...this.nodes.get(id)?.connections || []];
  }

  isReachable(start, target) {
    const visited = new Set();
    const stack = [start];
    
    while (stack.length > 0) {
      const current = stack.pop();
      if (current === target) return true;
      if (!visited.has(current)) {
        visited.add(current);
        // Traverse children for normal reachability check
        const children = this.getChildren(current);
        for (let i = children.length - 1; i >= 0; i--) {
          stack.push(children[i]);
        }
      }
    }
    return false;
  }

  willCreateCycle(source, target) {
  const visited = new Set();
  const stack = [target]; // Start from target and check if it can reach source

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === source) return true; // Cycle detected
    
    if (!visited.has(current)) {
      visited.add(current);
      // Check parents (incoming edges) instead of children
      const parents = this.getParents(current);
      for (const parent of parents) {
        stack.push(parent);
      }
    }
  }
  return false;
}

  getEdgePath(sourceNode, targetNode) {
    const dx = targetNode.x - sourceNode.x;
    const dy = targetNode.y - sourceNode.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const offset = 20; // Node radius

    // Calculate adjusted endpoints
    const startX = (dx / length) * offset;
    const startY = (dy / length) * offset;
    const endX = dx - (dx / length) * offset;
    const endY = dy - (dy / length) * offset;

    return `M${startX},${startY} L${endX},${endY}`;
  }

  topologicalSort() {
    const inDegree = new Map();
    const queue = [];
    const result = [];

    this.nodes.forEach((node, id) => {
      const degree = this.getParents(id).length;
      inDegree.set(id, degree);
      if (degree === 0) queue.push(id);
    });

    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node);

      this.getChildren(node).forEach(child => {
        inDegree.set(child, inDegree.get(child) - 1);
        if (inDegree.get(child) === 0) queue.push(child);
      });
    }

    return result;
  }

  longestPath() {
    const topOrder = this.topologicalSort();
    const dist = new Map();
    const prev = new Map();

    // Initialize distances and predecessors
    topOrder.forEach(node => {
      dist.set(node, 0);
      prev.set(node, null);
    });

    let maxDist = 0;
    let endNode = null;

    // Process nodes in topological order
    topOrder.forEach(node => {
      this.getChildren(node).forEach(child => {
        if (dist.get(child) < dist.get(node) + 1) {
          dist.set(child, dist.get(node) + 1);
          prev.set(child, node);
          if (dist.get(child) > maxDist) {
            maxDist = dist.get(child);
            endNode = child;
          }
        }
      });
    });

    // Reconstruct path
    const path = [];
    while (endNode !== null) {
      path.unshift(endNode);
      endNode = prev.get(endNode);
    }
    return path.length > 0 ? path : [];
  }

  shortestPath(source, target) {
    const visited = new Set();
    const queue = [[source, [source]]];

    while (queue.length > 0) {
      const [current, path] = queue.shift();
      if (current === target) return path;

      if (!visited.has(current)) {
        visited.add(current);
        this.getChildren(current).forEach(child => {
          queue.push([child, [...path, child]]);
        });
      }
    }
    return [];
  }
}

// =====================
// React Component
// =====================


const GraphVisualizer = () => {
  const [graphType, setGraphType] = useState(null);
  const [graph, setGraph] = useState(null);
  const [nodeInput, setNodeInput] = useState('');
  const [deleteInput, setDeleteInput] = useState('');
  const [traversalPath, setTraversalPath] = useState([]);
  const [uInput, setUInput] = useState('');
  const [vInput, setVInput] = useState('');
  const containerRef = useRef(null);

  const graphOperations = {
    undirected: {
      'Graph Analysis': [
        { label: 'Check Adjacent', action: 'hasEdge', inputs: 2 },
        { label: 'Get Neighbors', action: 'getNeighbors', inputs: 1 },
        { label: 'Check Cycle', action: 'hasCycle', inputs: 0 }
      ],
      'Traversal & Algorithms': [
        { label: 'BFS Traversal', action: 'bfs', inputs: 1 },
        { label: 'DFS Traversal', action: 'dfs', inputs: 1 },
        { label: 'Connected Components', action: 'connectedComponents', inputs: 0 }
      ]
    },
    dag: {
      'Graph Analysis': [
        { label: 'Get Parents', action: 'getParents', inputs: 1 },
        { label: 'Get Children', action: 'getChildren', inputs: 1 },
        { label: 'Check Reachable', action: 'isReachable', inputs: 2 }
      ],
      'Traversal & Algorithms': [
        { label: 'Topological Sort', action: 'topologicalSort', inputs: 0 },
        { label: 'Longest Path', action: 'longestPath', inputs: 0 },
        { label: 'Shortest Path', action: 'shortestPath', inputs: 2 }
      ]
    }
  };

  const commonOperations = [
    { label: 'Clear Graph', action: 'clearGraph', inputs: 0 },
    { label: 'Check Empty', action: 'isEmpty', inputs: 0 }
  ];


  const calculateLayout = (currentGraph) => {
    const container = containerRef.current;
    if (!container || !currentGraph) return;

    const layoutGraph = currentGraph.clone();
    const nodes = Array.from(layoutGraph.nodes.values());
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    if (graphType === 'dag') {
      const cols = Math.ceil(Math.sqrt(nodes.length));
      nodes.forEach((node, idx) => {
        node.x = (width / (cols + 1)) * ((idx % cols) + 1);
        node.y = (height / (cols + 1)) * (Math.floor(idx / cols) + 1);
      });
    } else {
      const radius = Math.min(width, height) * 0.4;
      const angle = (2 * Math.PI) / nodes.length;
      nodes.forEach((node, idx) => {
        node.x = width / 2 + radius * Math.cos(angle * idx);
        node.y = height / 2 + radius * Math.sin(angle * idx);
      });
    }
    setGraph(layoutGraph);
  };

  const handleGraphTypeChange = (type) => {
    const newGraph = type === 'dag' ? new DAG() : new UndirectedGraph();
    setGraphType(type);
    setGraph(newGraph);
  };

  const handleOperation = (operation) => {
    if (!graph) {  // Add this null check
      alert('Please select a graph type first!');
      return;
    }
    try {
      const newGraph = graph.clone();
      let result;
      switch (operation.action) {
        case 'addNode':
          newGraph.addNode(nodeInput);
          setNodeInput('');
          break;
        case 'deleteNode':
          newGraph.deleteNode(deleteInput);
          setDeleteInput('');
          break;
        case 'addEdge':
          newGraph.addEdge(uInput, vInput);
          setUInput('');
          setVInput('');
          break;
        case 'deleteEdge':  // Fixed case name
          newGraph.deleteEdge(uInput, vInput);
          setUInput('');
          setVInput('');
          break;
        case 'getNeighbors':
          result = newGraph.getNeighbors(uInput).join(', ');  // Changed to uInput
          alert(`Neighbors: ${result}`);
          break;
        case 'hasCycle':
          result = newGraph.hasCycle();
          alert(`Cycle detected: ${result}`);
          break;
        case 'connectedComponents':
          result = newGraph.connectedComponents().map(c => c.join(', ')).join(' | ');
          alert(`Components: ${result}`);
          break;
        case 'bfs':
          result = newGraph[operation.action](uInput);  // Changed to uInput
          setTimeout(() => animateTraversal(result), 100);
          // setTraversalPath(result);
          break;
        case 'dfs':
          result = newGraph[operation.action](uInput);  // Changed to uInput
          setTimeout(() => animateTraversal(result), 100);
          break;
        case 'getParents':
          result = newGraph.getParents(uInput).join(', ');  // Changed to uInput
          alert(`Parents: ${result}`);
          break;
        case 'getChildren':
          result = newGraph.getChildren(uInput).join(', ');  // Changed to uInput
          alert(`Children: ${result}`);
          break;
        case 'isReachable':
          result = newGraph.isReachable(uInput, vInput);  // Changed to use uInput and vInput
          alert(`Reachable: ${result}`);
          break;
        case 'topologicalSort':
          result = newGraph.topologicalSort();
          if (result.length === 0) {
            alert("Graph is empty");
          } else {
            setTraversalPath(result);
            alert(`Topological order: ${result.join(' → ')}`);
          }
          break;
        case 'longestPath':
          result = newGraph.longestPath();
          if (result.length === 0) {
            alert("No path exists");
          } else {
            setTraversalPath(result);
            alert(`Longest path: ${result.join(' → ')}`);
          }
          break;
        case 'hasEdge':
          result = newGraph.hasEdge(uInput, vInput);
          alert(`Nodes ${uInput} and ${vInput} are adjacent: ${result}`);
          break;
        case 'clearGraph':
          newGraph.clearGraph();
          setTraversalPath([]); // Add this line
          break;

        case 'shortestPath':
          result = newGraph.shortestPath(uInput, vInput);
          if (result.length === 0) {
            alert("No path exists between these nodes");
          } else {
            alert(`Shortest path: ${result.join(' → ')}`);
            setTraversalPath(result);
          }
          break;
        case 'addNode':
        case 'deleteNode':
        case 'addEdge':
        case 'deleteEdge':
        case 'clearGraph':
          setTraversalPath([]);
          break;
        default:
          // Handle common operations that don't mutate the graph
          if (operation.action === 'clearGraph') {
            newGraph.clearGraph();
          } else if (operation.action === 'isEmpty') {
            result = newGraph.isEmpty();
            alert(`Graph is empty: ${result}`);
          }
          break;
      }
      setGraph(newGraph);
      calculateLayout(newGraph);
    } catch (error) {
      alert(error.message);
    }
  };
  const animateTraversal = (path) => {
    setTraversalPath([]);
    let currentStep = 0;

    const animateStep = () => {
      if (currentStep < path.length) {
        setTraversalPath(prev => [...prev, path[currentStep]]);
        currentStep++;
        requestAnimationFrame(animateStep);
      }
      else {
        setTraversalPath(path); // Clear traversal path after animation
      }
    };

    requestAnimationFrame(animateStep);
  };
  return (
    <div className="visualizer-container">
      {/* Operations Panel (1/3 width) */}
      <div className="operations-panel">
        <select
          className="graph-selector"
          value={graphType || ''}
          onChange={(e) => {
            handleGraphTypeChange(e.target.value);
          }}
        >
          <option value="">Select Graph Type</option>
          <option value="undirected">Undirected Graph</option>
          <option value="dag">Directed Acyclic Graph</option>
        </select>

        {graphType && (
          <>
            {/* Node Operations */}
            <div className="operation-group">
              <h3>Node Operations</h3>
              <div className="input-group">
                <input
                  placeholder="Enter node ID"
                  value={nodeInput}
                  onChange={(e) => setNodeInput(e.target.value)}
                />
                <button onClick={() => handleOperation({ action: 'addNode' })}>
                  Add Node
                </button>
              </div>
              <div className="input-group">
                <input
                  placeholder="Node to delete"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                />
                <button onClick={() => handleOperation({ action: 'deleteNode' })}>
                  Delete Node
                </button>
              </div>
              <div className="operation-group">
                <h3>Edge Operations</h3>
                <div className="input-group">
                  <input
                    placeholder="Source/Direction u"
                    value={uInput}
                    onChange={(e) => setUInput(e.target.value)}
                  />
                  <input
                    placeholder="Target/Direction v"
                    value={vInput}
                    onChange={(e) => setVInput(e.target.value)}
                  />
                  <div className="button-group">
                    <button onClick={() => handleOperation({ action: 'addEdge' })}>
                      Add Edge
                    </button>
                    <button
                      onClick={() => handleOperation({ action: 'deleteEdge' })}
                      className="delete-btn"
                    >
                      Delete Edge
                    </button>
                    <button
                      onClick={() => handleOperation({ action: 'clearGraph' })}
                      className="clear-btn"
                    >
                      Clear Graph
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Graph-specific Operations */}
            {/* Modify the operation button rendering section */}
            {Object.entries(graphOperations[graphType]).map(([category, ops]) => (
              <div key={category} className="operation-group">
                <h3>{category}</h3>
                {ops.map((op) => (
                  <div key={op.label} className="operation-wrapper">
                    {/* Add input fields for hasEdge check */}
                    {op.action === 'hasEdge' ? (
                      <div className="input-group">
                        <input
                          placeholder="Node u"
                          value={uInput}
                          onChange={(e) => setUInput(e.target.value)}
                        />
                        <input
                          placeholder="Node v"
                          value={vInput}
                          onChange={(e) => setVInput(e.target.value)}
                        />
                        <button
                          className="operation-btn"
                          onClick={() => handleOperation(op)}
                        >
                          {op.label}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="operation-btn"
                        onClick={() => handleOperation(op)}
                      >
                        {op.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Graph Display (2/3 width) */}
      <div className="graph-display" ref={containerRef}>
        {graph && (
          <svg width="100%" height="100%">
          {graphType === 'dag' && ( 
            <defs>
              <marker
                id="arrow"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,7 L9,3.5 z" fill="#FF0000" />
              </marker>
            </defs>
          )}
            {Array.from(graph.nodes.values()).map(node => (
              <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                {Array.from(node.connections).map(connection => {
                  const target = graph.nodes.get(connection);
                  return (
                    <path
                      key={`${node.id}-${connection}`}
                      d={graphType === 'dag'
                        ? graph.getEdgePath(node, target)
                        : `M0,0 L${target.x - node.x},${target.y - node.y}`}
                      stroke="#607D8B"
                      strokeWidth="2"
                      fill="none"
                      markerEnd={graphType === 'dag' ? "url(#arrow)" : ""}
                    />
                  );
                })}
                <circle
                  r="20"
                  fill={traversalPath.includes(node.id) ? '#FF5722' : node.color}
                />
                <text y="5" fill="white" textAnchor="middle">
                  {node.id}
                </text>
              </g>
            ))}
          </svg>
        )};
        {traversalPath.length > 0 && (
          <div className="traversal-path-display">
            Traversal Path: {traversalPath.join(' → ')}
          </div>
        )}
      </div>
    </div>
  );
};


export default GraphVisualizer;