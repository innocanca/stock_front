import React, { useState } from 'react';
import Header from './components/Header';
import SectorGrid from './components/SectorGrid';
import UndervaluedStocks from './components/UndervaluedStocks';
import WeeklyVolumeSurge from './components/WeeklyVolumeSurge';
import BottomReversal from './components/BottomReversal';
import EtfVolumeSurge from './components/EtfVolumeSurge';
import { mockSectors } from './data/mockData';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'sectors' | 'undervalued' | 'weeklyVolumeSurge' | 'bottomReversal' | 'etfVolumeSurge'>('undervalued');

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <h1 className="page-title">股票量化交易平台</h1>
          <p className="page-subtitle">实时追踪各板块龙头企业，把握投资机会</p>
          
          {/* 导航标签 */}
          <div className="nav-tabs">
            <button 
              className={`tab-button ${activeTab === 'undervalued' ? 'active' : ''}`}
              onClick={() => setActiveTab('undervalued')}
            >
              低估蓝筹白马
            </button>
            <button 
              className={`tab-button ${activeTab === 'weeklyVolumeSurge' ? 'active' : ''}`}
              onClick={() => setActiveTab('weeklyVolumeSurge')}
            >
              主板周线放量
            </button>
            <button 
              className={`tab-button ${activeTab === 'bottomReversal' ? 'active' : ''}`}
              onClick={() => setActiveTab('bottomReversal')}
            >
              底部反转
            </button>
            <button 
              className={`tab-button ${activeTab === 'etfVolumeSurge' ? 'active' : ''}`}
              onClick={() => setActiveTab('etfVolumeSurge')}
            >
              ETF 放量策略
            </button>
            <button 
              className={`tab-button ${activeTab === 'sectors' ? 'active' : ''}`}
              onClick={() => setActiveTab('sectors')}
            >
              板块概览
            </button>
          </div>

          {/* 内容区域 */}
          <div className="tab-content">
            {activeTab === 'undervalued' && <UndervaluedStocks />}
            {activeTab === 'weeklyVolumeSurge' && <WeeklyVolumeSurge />}
            {activeTab === 'bottomReversal' && <BottomReversal />}
            {activeTab === 'etfVolumeSurge' && <EtfVolumeSurge />}
            {activeTab === 'sectors' && <SectorGrid sectors={mockSectors} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
