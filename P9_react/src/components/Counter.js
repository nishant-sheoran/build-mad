import React, { useState } from 'react';
import Display from './Display';
import './Counter.css';

function Counter() {
  // State for the count value
  const [count, setCount] = useState(0);

  // Function to increment the count
  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  // Function to decrement the count
  const decrement = () => {
    setCount(prevCount => prevCount - 1);
  };

  // Function to reset the count
  const reset = () => {
    setCount(0);
  };

  // Function to increment by 5
  const incrementByFive = () => {
    setCount(prevCount => prevCount + 5);
  };

  // Function to decrement by 5
  const decrementByFive = () => {
    setCount(prevCount => prevCount - 5);
  };

  return (
    <div className="counter">
      <h3>Counter Component</h3>
      
      {/* Display component receives count as prop */}
      <Display count={count} />
      
      <div className="counter-controls">
        <div className="button-row">
          <button onClick={decrementByFive} className="counter-btn decrement-five">
            -5
          </button>
          <button onClick={decrement} className="counter-btn decrement">
            -1
          </button>
          <button onClick={reset} className="counter-btn reset">
            Reset
          </button>
          <button onClick={increment} className="counter-btn increment">
            +1
          </button>
          <button onClick={incrementByFive} className="counter-btn increment-five">
            +5
          </button>
        </div>
      </div>

      <div className="counter-info">
        <p>This Counter component manages the state and passes the count to the Display component as a prop.</p>
        <p><strong>Current count:</strong> {count}</p>
      </div>
    </div>
  );
}

export default Counter;
