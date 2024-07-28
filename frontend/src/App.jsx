//import React from 'react';
import Home from '../src/components/Home.jsx';
import { MarketplaceProvider } from '../context/Marketplace.jsx';

const App = () => (
  <MarketplaceProvider>
    <Home />
  </MarketplaceProvider>
);

export default App;
