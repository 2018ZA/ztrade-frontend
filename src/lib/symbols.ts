// Топ-10 криптовалют + JUP + металлы.
// API принимает и базовый (eth), и полный (ETHUSDT) тикер — fallback на сервере.

export interface SymbolOption {
  id: string;
  label: string;
  group: 'crypto' | 'metal';
}

export const SYMBOLS: SymbolOption[] = [
  { id: 'btc',  label: 'BTC — Bitcoin',    group: 'crypto' },
  { id: 'eth',  label: 'ETH — Ethereum',   group: 'crypto' },
  { id: 'bnb',  label: 'BNB — Binance',    group: 'crypto' },
  { id: 'xrp',  label: 'XRP — Ripple',     group: 'crypto' },
  { id: 'sol',  label: 'SOL — Solana',     group: 'crypto' },
  { id: 'trx',  label: 'TRX — TRON',       group: 'crypto' },
  { id: 'doge', label: 'DOGE — Dogecoin',  group: 'crypto' },
  { id: 'ada',  label: 'ADA — Cardano',    group: 'crypto' },
  { id: 'jup',  label: 'JUP — Jupiter',    group: 'crypto' },
  { id: 'ton',  label: 'TON — Toncoin',    group: 'crypto' },
  { id: 'link', label: 'LINK — Chainlink', group: 'crypto' },
  { id: 'xau',  label: 'XAU — Золото',     group: 'metal' },
  { id: 'xag',  label: 'XAG — Серебро',    group: 'metal' },
  { id: 'xpt',  label: 'XPT — Платина',    group: 'metal' },
];

export const DEFAULT_SYMBOL = 'eth';
