# 股票量化交易平台

一个现代化的股票信息展示平台，展示各个行业板块的龙头企业信息。

## 功能特性

- 📊 **板块分析**: 展示科技、金融、医药、消费、能源、制造等主要板块
- 🏢 **龙头企业**: 每个板块显示3个主要的龙头企业
- 📈 **实时数据**: 显示股价、涨跌幅、成交量、市值等关键指标
- 📱 **响应式设计**: 适配桌面端、平板和移动端
- 🎨 **现代UI**: 采用现代化设计风格和动画效果

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: CSS3 + CSS Variables
- **开发环境**: Node.js + npm

## 快速开始

### 1. 安装依赖

如果还没有安装Node.js和npm，请先安装：

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y nodejs npm

# 或者从官网下载安装包
# https://nodejs.org/
```

安装项目依赖：

```bash
cd stock_front
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动。

### 3. 构建生产版本

```bash
npm run build
```

构建文件将输出到 `dist` 目录。

## 项目结构

```
stock_front/
├── src/
│   ├── components/          # React 组件
│   │   ├── Header.tsx      # 头部导航组件
│   │   ├── SectorGrid.tsx  # 板块网格组件
│   │   ├── SectorCard.tsx  # 单个板块卡片组件
│   │   └── StockItem.tsx   # 个股信息组件
│   ├── data/
│   │   └── mockData.ts     # 模拟股票数据
│   ├── types/
│   │   └── stock.ts        # TypeScript 类型定义
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx           # 应用入口文件
│   └── index.css          # 全局样式
├── public/                 # 静态资源
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── vite.config.ts        # Vite 配置
└── tsconfig.json         # TypeScript 配置
```

## 板块信息

当前展示的板块包括：

1. **科技板块** - 人工智能、芯片、软件企业
2. **金融板块** - 银行、保险、证券企业
3. **医药板块** - 生物制药、医疗器械企业
4. **消费板块** - 食品饮料、零售企业
5. **能源板块** - 石油、天然气、新能源企业
6. **制造板块** - 汽车、机械、电子制造企业

每个板块显示：
- 板块总成交量和总市值
- 3个代表性龙头企业
- 实时股价和涨跌幅信息

## 自定义开发

### 添加新的板块

在 `src/data/mockData.ts` 中添加新的板块数据：

```typescript
{
  id: 'new_sector',
  name: '新板块',
  description: '板块描述',
  totalVolume: 1000000000,
  totalMarketCap: 500000000000,
  leadingStocks: [
    // 添加股票数据
  ]
}
```

### 修改样式

所有样式文件都在对应组件目录中，使用CSS变量系统便于主题定制。

### 接入真实数据

替换 `src/data/mockData.ts` 中的模拟数据，接入真实的股票API。

## 开发命令

```bash
# 开发环境启动
npm run dev

# 生产构建
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License
