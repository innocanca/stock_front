import React from 'react';
import Header from './components/Header';
import SectorGrid from './components/SectorGrid';
import { mockSectors } from './data/mockData';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <h1 className="page-title">股票量化交易平台</h1>
          <p className="page-subtitle">实时追踪各板块龙头企业，把握投资机会</p>
          <SectorGrid sectors={mockSectors} />
        </div>
      </main>
    </div>
  );
}

export default App;
