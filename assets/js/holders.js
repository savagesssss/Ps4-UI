const MINT_ADDRESS = 'YOUR_TOKEN_MINT_ADDRESS';
const REFRESH_INTERVAL = 15000; // milliseconds

async function fetchHolders() {
  try {
    const url = `https://public-api.solscan.io/token/holders?tokenAddress=${MINT_ADDRESS}&offset=0&size=50`;
    const response = await fetch(url);
    if (!response.ok) return;
    const holders = await response.json();
    updateHolders(holders.data || holders); // solscan returns {data: []}
  } catch (e) {
    console.error('Failed to fetch holders', e);
  }
}

function shortAddress(addr) {
  return addr.slice(0, 4) + '...' + addr.slice(-4);
}

function updateHolders(list) {
  const container = document.getElementById('games');
  container.style.width = `${list.length * 12}em`;
  container.innerHTML = '';
  list.forEach((holder, idx) => {
    const a = document.createElement('a');
    a.href = '#';

    const square = document.createElement('div');
    square.className = 'squareGame animated bounceInLeft';

    const img = document.createElement('div');
    img.className = 'imgGame';
    img.tabIndex = 0;
    img.style.backgroundImage = `url(https://api.dicebear.com/6.x/identicon/svg?seed=${holder.owner || holder.address})`;

    const text = document.createElement('div');
    text.className = 'gameText';
    text.textContent = shortAddress(holder.owner || holder.address);

    const title = document.createElement('span');
    title.className = 'gameTitle';
    title.textContent = `#${idx + 1}`;

    square.appendChild(img);
    square.appendChild(text);
    square.appendChild(title);
    a.appendChild(square);
    container.appendChild(a);
  });
  if (typeof window.updateFocusableList === 'function') {
    window.updateFocusableList();
  }
}

fetchHolders();
setInterval(fetchHolders, REFRESH_INTERVAL);
