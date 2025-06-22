// App.js (React)
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AllCategories from './AllCategories';
import CategoryForm from './CategoryForm'; // For creating/editing categories

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/categories" element={<AllCategories />} />
        <Route path="/categories/new" element={<CategoryForm />} />
        <Route path="/categories/:id/edit" element={<CategoryForm />} />
      </Routes>
    </Router>
  );
}

export default App;