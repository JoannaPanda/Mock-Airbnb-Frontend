import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import HostedListing from './pages/HostedListing';
import CreatePage from './pages/CreatePage';
import ListingDetailsPage from './pages/ListingDetailsPage';
import SearchPage from './pages/SearchPage';
import EditListingPage from './pages/EditListing'
import BookRequestPage from './pages/BookRequest';

function App () {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/hosted-listings" element={<HostedListing />} />
          <Route path="/hosted-create" element={<CreatePage />} />
          <Route path="/listing/:listingId" element={<ListingDetailsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/edit-listing/:listingId" element={<EditListingPage />} />
          <Route path="/bookings/:listingId" element={<BookRequestPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
