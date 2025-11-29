import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h2>📈 股票量化</h2>
          </div>
          <nav className="nav">
            <a href="#home" className="nav-link active">首页</a>
            <a href="#markets" className="nav-link">市场</a>
            <a href="#analysis" className="nav-link">分析</a>
            <a href="#portfolio" className="nav-link">组合</a>
          </nav>
          <div className="header-actions">
            <button className="btn-secondary">登录</button>
            <button className="btn-primary">注册</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
