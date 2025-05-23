export function formatPriceUSD(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatPriceEUR(price) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price * 0.85); // we can adjust the conversion according to the actual rate
}

//Steven Savarin W03
