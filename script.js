// Fetch cryptocurrency data from CoinGecko API
const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';

const fetchCryptoData = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    displayCryptos(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Display cryptocurrency data in the listing section
const displayCryptos = (data) => {
  const cryptoList = document.getElementById('crypto-data');
  cryptoList.innerHTML = '';

  data.slice(0, 20).forEach((crypto) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${crypto.name} (${crypto.symbol.toUpperCase()})</span>
      <span>Price: $${crypto.current_price.toFixed(2)}</span>
      <button onclick="addToComparison('${crypto.id}', '${crypto.name}', ${crypto.current_price})">Compare</button>
    `;
    cryptoList.appendChild(listItem);
  });
};

// Manage comparison section
const comparisonContainer = document.getElementById('comparison-container');
const comparisonData = JSON.parse(localStorage.getItem('comparisonData')) || [];

const addToComparison = (id, name, price) => {
  if (comparisonData.length >= 5) {
    alert('You can only compare up to 5 cryptocurrencies.');
    return;
  }

  comparisonData.push({ id, name, price });
  localStorage.setItem('comparisonData', JSON.stringify(comparisonData));
  updateComparisonUI();
};

const updateComparisonUI = () => {
  comparisonContainer.innerHTML = '';

  comparisonData.forEach((crypto, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <span>${crypto.name}</span>
      <span>Price: $${crypto.price.toFixed(2)}</span>
      <button onclick="removeFromComparison(${index})">Remove</button>
    `;
    comparisonContainer.appendChild(div);
  });
};

const removeFromComparison = (index) => {
  comparisonData.splice(index, 1);
  localStorage.setItem('comparisonData', JSON.stringify(comparisonData));
  updateComparisonUI();
};

// Manage user preferences
document.getElementById('preferences-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const sortOption = document.getElementById('sort-options').value;
  localStorage.setItem('sortPreference', sortOption);
  alert('Preferences saved!');
});

// Initial Load
fetchCryptoData();
updateComparisonUI();
setInterval(fetchCryptoData, 60000); // Refresh every minute
