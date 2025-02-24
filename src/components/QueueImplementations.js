// QueueImplementations.js
export class LinearQueue {
    constructor(size) {
      this.size = size;
      this.queue = [];
    }
  
    enqueue(value) {
      if (this.isFull()) throw new Error('Queue is full');
      this.queue.push(value);
    }
  
    dequeue() {
      if (this.isEmpty()) throw new Error('Queue is empty');
      return this.queue.shift();
    }
  
    peek() {
      return this.isEmpty() ? null : this.queue[0];
    }
  
    isEmpty() {
      return this.queue.length === 0;
    }
  
    isFull() {
      return this.queue.length >= this.size;
    }
  
    getElements() {
      return [...this.queue, ...Array(this.size - this.queue.length).fill(null)];
    }
    clone() {
        const newQueue = new LinearQueue(this.size);
        newQueue.queue = [...this.queue];
        return newQueue;
      }
  }

export class CircularQueue {
    constructor(size) {
      this.size = size;
      this.queue = Array(size).fill(null);
      this.front = -1;
      this.rear = -1;
    }
  
    enqueue(value) {
      if (this.isFull()) throw new Error('Queue is full');
      if (this.isEmpty()) this.front = 0;
      this.rear = (this.rear + 1) % this.size;
      this.queue[this.rear] = value;
    }
  
    dequeue() {
      if (this.isEmpty()) throw new Error('Queue is empty');
      const value = this.queue[this.front];
      this.queue[this.front] = null;
      if (this.front === this.rear) {
        this.front = -1;
        this.rear = -1;
      } else {
        this.front = (this.front + 1) % this.size;
      }
      return value;
    }
  
    peek() {
      if (this.isEmpty()) return null;
      return this.queue[this.front];
    }
  
    isEmpty() {
      return this.front === -1;
    }
  
    isFull() {
      return (this.rear + 1) % this.size === this.front;
    }
  
    getElements() {
        if (this.isEmpty()) return Array(this.size).fill(null);
        
        const elements = [];
        let current = this.front;
        while (true) {
          elements.push(this.queue[current]);
          if (current === this.rear) break;
          current = (current + 1) % this.size;
        }
        return elements.concat(Array(this.size - elements.length).fill(null));
    }
    clone() {
        const newQueue = new CircularQueue(this.size);
        newQueue.queue = [...this.queue];
        newQueue.front = this.front;
        newQueue.rear = this.rear;
        return newQueue;
      }
  }
  
  export class Deque {
    constructor(size) {
      this.size = size;
      this.queue = Array(size).fill(null);
      this.front = -1;
      this.rear = 0;
    }
    enqueue(value) {
        this.addRear(value);
      }
  
    addFront(value) {
      if (this.isFull()) throw new Error('Deque is full');
      if (this.isEmpty()) {
        this.front = 0;
        this.rear = 0;
      } else {
        this.front = (this.front - 1 + this.size) % this.size;
      }
      this.queue[this.front] = value;
    }
  
    addRear(value) {
      if (this.isFull()) throw new Error('Deque is full');
      if (this.isEmpty()) {
        this.front = 0;
        this.rear = 0;
      } else {
        this.rear = (this.rear + 1) % this.size;
      }
      this.queue[this.rear] = value;
    }
  
    removeFront() {
      if (this.isEmpty()) throw new Error('Deque is empty');
      const value = this.queue[this.front];
      this.queue[this.front] = null;
      
      if (this.front === this.rear) {
        this.front = -1;
        this.rear = -1;
      } else {
        this.front = (this.front + 1) % this.size;
      }
      return value;
    }
  
    removeRear() {
      if (this.isEmpty()) throw new Error('Deque is empty');
      const value = this.queue[this.rear];
      this.queue[this.rear] = null;
      
      if (this.front === this.rear) {
        this.front = -1;
        this.rear = -1;
      } else {
        this.rear = (this.rear - 1 + this.size) % this.size;
      }
      return value;
    }
    peek() {
        return this.peekFront();
    }

    peekFront() {
        return this.isEmpty() ? null : this.queue[this.front];
    }
    
    peekRear() {
        return this.isEmpty() ? null : this.queue[this.rear];
    }
  
    isEmpty() {
      return this.front === -1;
    }
  
    isFull() {
      return (this.rear + 1) % this.size === this.front;
    }
  
    getElements() {
      if (this.isEmpty()) return Array(this.size).fill(null);
      
      const elements = [];
      let current = this.front;
      let count = 0;
      
      while (count < this.size) {
        elements.push(this.queue[current]);
        if (current === this.rear) break;
        current = (current + 1) % this.size;
        count++;
      }
      
      // Fill remaining slots with null
      while (elements.length < this.size) {
        elements.push(null);
      }
      
      return elements;
    }
  
    clone() {
      const newDeque = new Deque(this.size);
      newDeque.queue = [...this.queue];
      newDeque.front = this.front;
      newDeque.rear = this.rear;
      return newDeque;
    }
  }
  
  export class PriorityQueue {
    constructor() {
      this.queue = [];
    }
  
    enqueue(value, priority) {
      const element = { value, priority };
      let added = false;
      for (let i = 0; i < this.queue.length; i++) {
        if (element.priority < this.queue[i].priority) {
          this.queue.splice(i, 0, element);
          added = true;
          break;
        }
      }
      if (!added) this.queue.push(element);
    }
  
    dequeue() {
      if (this.isEmpty()) throw new Error('Priority queue is empty');
      return this.queue.shift().value;
    }
  
    peek() {
      return this.isEmpty() ? null : this.queue[0].value;
    }
  
    isEmpty() {
      return this.queue.length === 0;
    }
  
    getElements() {
      return this.queue;
    }
    clone() {
        const newQueue = new PriorityQueue();
        newQueue.queue = [...this.queue];
        return newQueue;
      }
  }