const priceHistory = require('./priceHistory');
const alertService = require('./alertService');

const INTERVAL_MS = 30000;

let intervalId = null;
let latestPrice = null;

async function fetchPrice() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await res.json();
    latestPrice = {
      price: data.ethereum.usd,
      change24h: data.ethereum.usd_24h_change,
      timestamp: new Date().toISOString(),
    };

    priceHistory.record(latestPrice);

    const triggered = alertService.checkAlerts(latestPrice.price);
    if (triggered.length > 0) {
      console.log(`[EtherScan] ${triggered.length} alert(s) triggered at $${latestPrice.price}`);
    }

    console.log(
      `[EtherScan] ETH/USD: $${latestPrice.price} (${latestPrice.change24h >= 0 ? '+' : ''}${latestPrice.change24h.toFixed(2)}%)`
    );
  } catch (err) {
    console.error('[EtherScan] Failed to fetch price:', err.message);
  }
}

function start() {
  console.log('[EtherScan] Scanner started');
  fetchPrice();
  intervalId = setInterval(fetchPrice, INTERVAL_MS);
}

function stop() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('[EtherScan] Scanner stopped');
  }
}

function getLatestPrice() {
  return latestPrice;
}

module.exports = { start, stop, getLatestPrice };
