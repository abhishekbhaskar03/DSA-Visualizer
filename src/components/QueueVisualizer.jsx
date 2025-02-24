import React, { useState } from 'react';
import '../css/QueueVisualizer.css';
import { LinearQueue, CircularQueue, Deque, PriorityQueue } from './QueueImplementations';

const QueueVisualizer = () => {
  // State variables
  const [queueType, setQueueType] = useState('');
  const [queue, setQueue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState('');

  // Initialize queue based on selected type
  const initializeQueue = () => {
    switch(queueType) {
      case 'Simple Queue (Linear Queue)': return new LinearQueue(8);
      case 'Circular Queue': return new CircularQueue(8);
      case 'Double-Ended Queue (Deque)': return new Deque(8);
      case 'Priority Queue': return new PriorityQueue();
      default: return null;
    }
  };

  // Generate random queue
  const handleGenerateRandom = () => {
    const newQueue = initializeQueue();
    const randomValues = Array.from({length: 5}, () => Math.floor(Math.random() * 100) + 1);
    
    try {
      if (queueType === 'Double-Ended Queue (Deque)') {
        // For Deque, fill sequentially from front
        randomValues.forEach(val => newQueue.addRear(val));
      } else {
        // Existing logic for other queues
        randomValues.forEach(val => {
          if (queueType === 'Priority Queue') {
            newQueue.enqueue(val, Math.floor(Math.random() * 5) + 1);
          } else {
            newQueue.enqueue(val);
          }
        });
      }
      setQueue(newQueue);
    } catch (e) {
      alert(e.message);
    }
  };

  // Handle enqueue operation
  const handleEnqueue = () => {
    if (!inputValue) return;
    
    try {
      const newQueue = queue.clone();
      if (queueType === 'Priority Queue') {
        newQueue.enqueue(inputValue, Number(priority));
      } else {
        newQueue.enqueue(inputValue);
      }
      setQueue(newQueue);
      setInputValue('');
      setPriority('');
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle regular dequeue
  const handleDequeue = () => {
    try {
      const newQueue = queue.clone();
      newQueue.dequeue();
      
      // Animate removal
      const elements = queue.getElements();
      if (elements.length > 0) {
        const tempElement = document.querySelector(`.stack-element:nth-child(${elements.length})`);
        tempElement?.classList.add('removing');
        
        setTimeout(() => {
          setQueue(newQueue);
        }, 300);
      } else {
        setQueue(newQueue);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Deque-specific operations
  const handleDequeFront = () => {
    try {
      const newQueue = queue.clone();
      newQueue.removeFront();
      setQueue(newQueue);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDequeRear = () => {
    try {
      const newQueue = queue.clone();
      newQueue.removeRear();
      setQueue(newQueue);
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePeek = () => {
    try {
      if (queueType === 'Double-Ended Queue (Deque)') {
        alert(`Front: ${queue.peekFront()}\nRear: ${queue.peekRear()}`);
      } else {
        alert(`Front element: ${queue.peek()}`);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Render JSX
  return (
    <div className="visualizer-container">
      <h2>Queue Visualizer</h2>
      
      <div className="controls">
        <select 
          value={queueType}
          onChange={(e) => setQueueType(e.target.value)}
        >
          <option value="">Select Queue Type</option>
          <option value="Simple Queue (Linear Queue)">Simple Queue</option>
          <option value="Circular Queue">Circular Queue</option>
          <option value="Double-Ended Queue (Deque)">Deque</option>
          <option value="Priority Queue">Priority Queue</option>
        </select>

        <button 
          onClick={handleGenerateRandom}
          disabled={!queueType}
        >
          Generate Random Queue
        </button>
      </div>

      {queue && (
        <div className="queue-operations">
          <div className="input-group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
            />
            
            {queueType === 'Priority Queue' && (
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder="Priority"
              />
            )}

            <button onClick={handleEnqueue} disabled={!inputValue}>
              Enqueue
            </button>
          </div>

          <div className="operation-buttons">
            {queueType === 'Double-Ended Queue (Deque)' ? (
              <>
                <button onClick={handleDequeFront}>Remove Front</button>
                <button onClick={handleDequeRear}>Remove Rear</button>
              </>
            ) : (
              <button onClick={handleDequeue}>Dequeue</button>
            )}
            
            <button onClick={handlePeek}> Peek </button>
            <button onClick={() => alert(`Empty: ${queue.isEmpty()}`)}>
              isEmpty
            </button>
            {queueType !== 'Priority Queue' && (
              <button onClick={() => alert(`Full: ${queue.isFull()}`)}>
                isFull
              </button>
            )}
          </div>
        </div>
      )}

      <div className="stack-display">
        {queue?.getElements().map((item, index) => (
          <div key={index} className="stack-element">
            {queueType === 'Priority Queue' ? (
              <>{item?.value} (P: {item?.priority})</>
            ) : item !== null ? (
              item
            ) : (
              <span className="empty-slot">∅</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueueVisualizer;