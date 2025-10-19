import React, { useState } from 'react';
import './App.css';
import Counter from './components/Counter';
import Display from './components/Display';

function App() {
  // Step 1: Initialize state for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [showCounter, setShowCounter] = useState(false);

  // Step 3: Handle Input Changes — handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value // Dynamic key update
    }));
  };

  // Step 4: Handle Form Submission — handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page refresh
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.age) {
      alert('Please fill in all fields!');
      return;
    }

    if (formData.age < 1 || formData.age > 120) {
      alert('Please enter a valid age between 1 and 120!');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address!');
      return;
    }

    console.log('Form Data:', formData);
    setSubmittedData({ ...formData });
    
    // Show success message
    alert(`✅ Form Submitted!\nName: ${formData.name}\nEmail: ${formData.email}\nAge: ${formData.age}`);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      age: ''
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      age: ''
    });
    setSubmittedData(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 React Learning Project</h1>
        <p>User Registration Form & Counter App</p>
      </header>

      <main className="App-main">
        {/* User Registration Form Section */}
        <section className="form-section">
          <h2>👤 User Registration Form</h2>
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input
                id="age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                min="1"
                max="120"
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="submit-btn">
                Submit
              </button>
              <button type="button" onClick={resetForm} className="reset-btn">
                Reset
              </button>
            </div>
          </form>

          {/* Display submitted data */}
          {submittedData && (
            <div className="submitted-data">
              <h3>✅ Form Submitted Successfully!</h3>
              <div className="data-display">
                <p><strong>Name:</strong> {submittedData.name}</p>
                <p><strong>Email:</strong> {submittedData.email}</p>
                <p><strong>Age:</strong> {submittedData.age}</p>
              </div>
            </div>
          )}

          {/* Current Form Data Display */}
          {Object.values(formData).some(value => value !== '') && (
            <div className="current-data">
              <h3>Current Form Data:</h3>
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>
          )}
        </section>

        {/* Counter App Section */}
        <section className="counter-section">
          <h2>🔢 Counter App</h2>
          <p>Learn React state management with a simple counter</p>
          
          <button 
            onClick={() => setShowCounter(!showCounter)}
            className="toggle-btn"
          >
            {showCounter ? 'Hide Counter' : 'Show Counter'}
          </button>

          {showCounter && (
            <div className="counter-container">
              <Counter />
            </div>
          )}
        </section>
      </main>

      <footer className="App-footer">
        <p>Built with React • Learn useState, props, and component structure</p>
      </footer>
    </div>
  );
}

export default App;
