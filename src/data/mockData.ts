import { Sector } from '../types/stock';

export const mockSectors: Sector[] = [
  {
    id: 'technology',
    name: '科技板块',
    description: '以人工智能、芯片、软件为主的科技类企业',
    totalVolume: 15420000000,
    totalMarketCap: 3250000000000,
    leadingStocks: [
      {
        code: '000001',
        name: '腾讯控股',
        price: 345.60,
        change: 12.80,
        changePercent: 3.85,
        volume: 2840000,
        marketCap: 332000000000
      },
      {
        code: '000002',
        name: '阿里巴巴',
        price: 89.45,
        change: -2.15,
        changePercent: -2.35,
        volume: 3200000,
        marketCap: 230000000000
      },
      {
        code: '000858',
        name: '五粮液',
        price: 128.90,
        change: 5.20,
        changePercent: 4.20,
        volume: 1850000,
        marketCap: 495000000000
      }
    ]
  },
  {
    id: 'finance',
    name: '金融板块',
    description: '银行、保险、证券等金融服务类企业',
    totalVolume: 22100000000,
    totalMarketCap: 4580000000000,
    leadingStocks: [
      {
        code: '601398',
        name: '工商银行',
        price: 5.42,
        change: 0.08,
        changePercent: 1.50,
        volume: 12500000,
        marketCap: 194000000000
      },
      {
        code: '601318',
        name: '中国平安',
        price: 52.30,
        change: -1.20,
        changePercent: -2.24,
        volume: 8200000,
        marketCap: 956000000000
      },
      {
        code: '000002',
        name: '万科A',
        price: 18.45,
        change: 0.65,
        changePercent: 3.65,
        volume: 5600000,
        marketCap: 203000000000
      }
    ]
  },
  {
    id: 'healthcare',
    name: '医药板块',
    description: '生物制药、医疗器械、医疗服务类企业',
    totalVolume: 8900000000,
    totalMarketCap: 2150000000000,
    leadingStocks: [
      {
        code: '000661',
        name: '长春高新',
        price: 156.80,
        change: 8.90,
        changePercent: 6.02,
        volume: 980000,
        marketCap: 63400000000
      },
      {
        code: '300015',
        name: '爱尔眼科',
        price: 42.15,
        change: -0.85,
        changePercent: -1.98,
        volume: 2100000,
        marketCap: 179000000000
      },
      {
        code: '002414',
        name: '高德红外',
        price: 28.90,
        change: 2.40,
        changePercent: 9.06,
        volume: 1650000,
        marketCap: 48200000000
      }
    ]
  },
  {
    id: 'consumer',
    name: '消费板块',
    description: '食品饮料、零售、家电等消费类企业',
    totalVolume: 12800000000,
    totalMarketCap: 2980000000000,
    leadingStocks: [
      {
        code: '600519',
        name: '贵州茅台',
        price: 1688.00,
        change: 25.60,
        changePercent: 1.54,
        volume: 680000,
        marketCap: 2120000000000
      },
      {
        code: '000596',
        name: '古井贡酒',
        price: 245.80,
        change: -8.20,
        changePercent: -3.23,
        volume: 1200000,
        marketCap: 123000000000
      },
      {
        code: '002304',
        name: '洋河股份',
        price: 89.70,
        change: 3.15,
        changePercent: 3.64,
        volume: 1580000,
        marketCap: 135000000000
      }
    ]
  },
  {
    id: 'energy',
    name: '能源板块',
    description: '石油、天然气、新能源等能源类企业',
    totalVolume: 18600000000,
    totalMarketCap: 3420000000000,
    leadingStocks: [
      {
        code: '600028',
        name: '中国石化',
        price: 5.85,
        change: 0.15,
        changePercent: 2.63,
        volume: 15200000,
        marketCap: 708000000000
      },
      {
        code: '000338',
        name: '潍柴动力',
        price: 14.25,
        change: -0.35,
        changePercent: -2.40,
        volume: 4800000,
        marketCap: 113000000000
      },
      {
        code: '300274',
        name: '阳光电源',
        price: 89.60,
        change: 7.20,
        changePercent: 8.74,
        volume: 2900000,
        marketCap: 134000000000
      }
    ]
  },
  {
    id: 'manufacturing',
    name: '制造板块',
    description: '汽车、机械、电子制造等制造业企业',
    totalVolume: 16200000000,
    totalMarketCap: 2890000000000,
    leadingStocks: [
      {
        code: '002415',
        name: '海康威视',
        price: 31.45,
        change: 1.85,
        changePercent: 6.25,
        volume: 8500000,
        marketCap: 293000000000
      },
      {
        code: '000625',
        name: '长安汽车',
        price: 12.80,
        change: -0.60,
        changePercent: -4.48,
        volume: 6200000,
        marketCap: 123000000000
      },
      {
        code: '002230',
        name: '科大讯飞',
        price: 52.30,
        change: 4.10,
        changePercent: 8.51,
        volume: 3400000,
        marketCap: 118000000000
      }
    ]
  }
];
