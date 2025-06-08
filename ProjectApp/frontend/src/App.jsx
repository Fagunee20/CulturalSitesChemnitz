import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import PlaceDetail from './pages/PlaceDetail';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Account from './pages/UserAccount';
import TenMinutePlaces from './pages/TenMinutePlaces'; // ✅ Import added

import { getToken } from './services/auth';

// 1. Create the HTTP link with credentials included for CORS + auth to work properly
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',  // <--- This line is important
});

// 2. Middleware to attach token to headers
const authLink = setContext((_, { headers }) => {
  const token = getToken();
  console.log('Using token:', token); // Debug to confirm token presence
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// 3. Combine auth and HTTP links
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            }
          />
          <Route path="/place/:id" element={<PlaceDetail />} />

          {/* ✅ New Private Route for 10-Minute View */}
          <Route
            path="/ten-minute"
            element={
              <PrivateRoute>
                <TenMinutePlaces />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
