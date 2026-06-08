const API_URL = '/api';

// Format currency
const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Show toast notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    
    container.appendChild(toast);
    
    // Remove after animation finishes
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// --- BUYER UI LOGIC ---
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        const list = document.getElementById('productList');
        if (!list) return; // not on index page

        list.innerHTML = '';
        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-info">
                    <h4>${p.name}</h4>
                    <p>Origin: ${p.origin} | Category: ${p.category}</p>
                </div>
                <div class="price">${formatMoney(p.price)}</div>
                <button class="btn btn-primary" onclick="openCheckout(${p.id}, ${p.price}, '${p.name}')">Buy Now</button>
            `;
            // Click card to show similar products
            card.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON') {
                    loadSimilarProducts(p.id);
                }
            });
            list.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function loadSimilarProducts(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}/similar`);
        const products = await response.json();
        
        const section = document.getElementById('similarProductsSection');
        const list = document.getElementById('similarProductList');
        
        if (products.length > 0) {
            section.classList.remove('hidden');
            list.innerHTML = '';
            products.forEach(p => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <h4>${p.name}</h4>
                    <div class="price">${formatMoney(p.price)}</div>
                    <button class="btn btn-secondary btn-sm" onclick="openCheckout(${p.id}, ${p.price}, '${p.name}')">Buy</button>
                `;
                list.appendChild(card);
            });
        } else {
            section.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error loading similar products:', error);
    }
}

let selectedProductForCheckout = null;

function openCheckout(productId, price, name) {
    selectedProductForCheckout = { id: productId, price, name };
    const modal = document.getElementById('checkoutModal');
    const details = document.getElementById('checkoutDetails');
    
    details.innerHTML = `
        <p><strong>Item:</strong> ${name}</p>
        <p><strong>Price:</strong> ${formatMoney(price)}</p>
    `;
    
    // reset payment method
    document.querySelector('input[name="payment"][value="cod"]').checked = true;
    document.getElementById('bnplWarning').classList.add('hidden');
    
    modal.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    // Payment method change listener
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const warning = document.getElementById('bnplWarning');
            if (e.target.value === 'bnpl') {
                warning.classList.remove('hidden');
            } else {
                warning.classList.add('hidden');
            }
        });
    });

    // Close modal
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('checkoutModal').classList.add('hidden');
        });
    }

    // Confirm Buy
    const confirmBtn = document.getElementById('confirmBuyBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            const userId = document.getElementById('userSelect').value;
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            
            try {
                const response = await fetch(`${API_URL}/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        buyerId: userId,
                        productId: selectedProductForCheckout.id,
                        paymentMethod: paymentMethod
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showToast(`Order created successfully! Total: ${formatMoney(result.totalPrice)}`, 'success');
                    document.getElementById('checkoutModal').classList.add('hidden');
                } else {
                    showToast(`Error: ${result.error}`, 'error');
                }
            } catch (error) {
                console.error('Checkout error:', error);
                showToast('Checkout failed. See console.', 'error');
            }
        });
    }
});


// --- ADMIN UI LOGIC ---
async function loadAdminData() {
    if (!document.getElementById('totalCommission')) return; // not admin page

    try {
        // Load stats
        const statsRes = await fetch(`${API_URL}/admin/stats`);
        const stats = await statsRes.json();
        
        document.getElementById('totalCommission').innerText = formatMoney(stats.totalCommission);
        document.getElementById('totalBnplInterest').innerText = formatMoney(stats.totalBnplInterest);
        document.getElementById('totalFraudOrders').innerText = stats.totalFraudOrders;

        // Load fraud orders
        const fraudRes = await fetch(`${API_URL}/admin/fraud-orders`);
        const frauds = await fraudRes.json();
        
        const tbody = document.getElementById('fraudList');
        tbody.innerHTML = '';
        
        frauds.forEach(f => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${f.id}</td>
                <td>User ${f.buyerId}</td>
                <td>${formatMoney(f.totalPrice)}</td>
                <td><span style="color: ${f.status === 'PENDING' ? 'orange' : (f.status === 'APPROVED' ? 'green' : 'red')}">${f.status}</span></td>
                <td>
                    ${f.status === 'PENDING' ? `
                        <button class="btn btn-primary" onclick="handleFraud(${f.id}, 'approve')">Approve</button>
                        <button class="btn btn-danger" onclick="handleFraud(${f.id}, 'reject')">Reject</button>
                    ` : 'Processed'}
                </td>
            `;
            tbody.appendChild(tr);
        });
        
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

async function handleFraud(orderId, action) {
    try {
        await fetch(`${API_URL}/admin/orders/${orderId}/${action}`, { method: 'POST' });
        loadAdminData(); // reload
    } catch (error) {
        console.error('Error handling fraud:', error);
    }
}
