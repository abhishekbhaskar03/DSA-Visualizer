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
    switch (queueType) {
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
    const randomValues = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100) + 1);

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

  return (
    <div className="queue-main-container" >
      <h1>Queue Visualizer</h1>

      {/* Generate Random Queue */}
      <div className="queue-control-group">
        <button
          onClick={handleGenerateRandom}
          className="queue-generate-btn"
          disabled={!queueType}
        >
          Generate Random Queue
        </button>
        <select
          value={queueType}
          onChange={(e) => setQueueType(e.target.value)}
          className="queue-type-select"
        >
          <option value="">Select Queue Type</option>
          <option value="Simple Queue (Linear Queue)">Simple Queue</option>
          <option value="Circular Queue">Circular Queue</option>
          <option value="Double-Ended Queue (Deque)">Deque</option>
          <option value="Priority Queue">Priority Queue</option>
        </select>
      </div>

      {/* Input Section */}
      <div className="queue-input-group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          className="queue-input"
        />
        {queueType === 'Priority Queue' && (
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            placeholder="Priority"
            className="queue-input"
          />
        )}
        <button
          onClick={handleEnqueue}
          className="queue-action-btn"
          disabled={!inputValue}
        >
          Enqueue
        </button>
      </div>

      {/* Operation Buttons */}
      <div className="queue-op-buttons">
        {queueType === 'Double-Ended Queue (Deque)' ? (
          <>
            <button className="queue-action-btn" onClick={handleDequeFront}>
              Remove Front
            </button>
            <button className="queue-action-btn" onClick={handleDequeRear}>
              Remove Rear
            </button>
          </>
        ) : (
          <button className="queue-action-btn" onClick={handleDequeue}>
            Dequeue
          </button>
        )}
        <button className="queue-status-btn" onClick={handlePeek}>
          Peek
        </button>
        <button className="queue-status-btn" onClick={() => alert(`Empty: ${queue?.isEmpty()}`)}>
          isEmpty
        </button>
        {queueType !== 'Priority Queue' && (
          <button className="queue-status-btn" onClick={() => alert(`Full: ${queue?.isFull()}`)}>
            isFull
          </button>
        )}
      </div>

      {/* Queue Display */}
      <div className="queue-horizontal-display">
        {queue?.getElements().map((item, index) => (
          <div key={index} className="queue-element">
            {queueType === 'Priority Queue' ? (
              <>{item?.value} <span className="queue-priority">(P: {item?.priority})</span></>
            ) : item !== null ? (
              item
            ) : (
              <span className="queue-empty">∅</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueueVisualizer;