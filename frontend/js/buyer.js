/* ===================================
   Buyer Page Logic — Shoppertainment
   =================================== */

let selectedProduct = null;

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
    initBuyerPage();
});

async function initBuyerPage() {
    await loadUsers();
    await loadProducts();
    setupCheckoutListeners();
}

// ---- Load Users into Dropdown ----
async function loadUsers() {
    try {
        const users = await Api.getUsers();
        const select = document.getElementById('userSelect');
        if (!select) return;

        select.innerHTML = '';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// ---- Load Products ----
async function loadProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    // Show skeleton
    grid.innerHTML = `
        <div class="product-card" style="opacity:0.5">
            <div class="skeleton" style="height:20px;width:60%"></div>
            <div class="skeleton" style="height:14px;width:40%;margin-top:8px"></div>
            <div class="skeleton" style="height:32px;width:100%;margin-top:12px"></div>
        </div>
    `.repeat(3);

    try {
        const products = await Api.getProducts();
        grid.innerHTML = '';

        products.forEach(product => {
            grid.appendChild(createProductCard(product));
        });
    } catch (error) {
        console.error('Error loading products:', error);
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <p class="empty-state-text">Cannot load products. Make sure the backend is running.</p>
            </div>
        `;
    }
}

// ---- Create Product Card ----
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);

    const isInternational = product.origin === 'INTERNATIONAL';
    const deliveryDays = isInternational ? DELIVERY_INTERNATIONAL_DAYS : DELIVERY_DOMESTIC_DAYS;

    card.innerHTML = `
        <div class="product-card-header">
            <span class="product-name">${escapeHtml(product.name)}</span>
            <div class="product-badges">
                <span class="badge ${isInternational ? 'badge-international' : 'badge-domestic'}">
                    ${isInternational ? '🌍 Quốc tế' : '🇻🇳 Nội địa'}
                </span>
            </div>
        </div>
        <div class="product-meta">
            <span class="chip"><span class="chip-icon">📦</span>${escapeHtml(product.category)}</span>
            <span class="product-delivery">
                <span class="product-delivery-icon">🚚</span>
                Giao trong ${deliveryDays} ngày
            </span>
        </div>
        <div class="product-footer">
            <span class="product-price">${formatMoney(product.price)}</span>
            <button class="btn-buy" id="buyBtn-${product.id}" onclick="event.stopPropagation(); openCheckout(${product.id}, ${product.price}, '${escapeHtml(product.name)}', '${product.origin}')">
                ⚡ Mua ngay
            </button>
        </div>
    `;

    // Click card to show similar
    card.addEventListener('click', () => {
        loadSimilarProducts(product.id);
        // Highlight active card
        document.querySelectorAll('.product-card').forEach(c => c.style.borderColor = '');
        card.style.borderColor = 'var(--primary-300)';
    });

    return card;
}

// ---- Load Similar Products ----
async function loadSimilarProducts(productId) {
    const section = document.getElementById('similarSection');
    const scroll = document.getElementById('similarScroll');
    if (!section || !scroll) return;

    try {
        const products = await Api.getSimilarProducts(productId);

        if (products.length > 0) {
            section.classList.remove('hidden');
            scroll.innerHTML = '';

            products.forEach(product => {
                const card = createSimilarCard(product);
                scroll.appendChild(card);
            });

            // Smooth scroll into view
            section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            section.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error loading similar products:', error);
    }
}

function createSimilarCard(product) {
    const card = document.createElement('div');
    card.className = 'similar-card';

    card.innerHTML = `
        <span class="product-name">${escapeHtml(product.name)}</span>
        <span class="chip" style="font-size:10px"><span class="chip-icon">📦</span>${escapeHtml(product.category)}</span>
        <span class="product-price">${formatMoney(product.price)}</span>
        <button class="btn-buy" onclick="event.stopPropagation(); openCheckout(${product.id}, ${product.price}, '${escapeHtml(product.name)}', '${product.origin}')">
            ⚡ Mua
        </button>
    `;

    return card;
}

// ---- Checkout Modal ----
function openCheckout(productId, price, name, origin) {
    selectedProduct = { id: productId, price, name, origin };

    const modal = document.getElementById('checkoutModal');
    const summary = document.getElementById('checkoutSummary');

    const isInternational = origin === 'INTERNATIONAL';
    const taxFee = isInternational ? price * IMPORT_TAX_RATE : 0;
    const deliveryDays = isInternational ? DELIVERY_INTERNATIONAL_DAYS : DELIVERY_DOMESTIC_DAYS;

    // Get selected user's subscription status (simplified - check if user is Alice)
    const userSelect = document.getElementById('userSelect');
    const selectedText = userSelect.options[userSelect.selectedIndex]?.text || '';
    const isSubscribed = selectedText.toLowerCase().includes('subscribed') || selectedText.toLowerCase().includes('subscribe');
    const shippingFee = isSubscribed ? 0 : SHIPPING_FEE_DEFAULT;

    summary.innerHTML = `
        <div class="checkout-row">
            <span class="checkout-row-label">Sản phẩm</span>
            <span class="checkout-row-value">${escapeHtml(name)}</span>
        </div>
        <div class="checkout-row">
            <span class="checkout-row-label">Giá gốc</span>
            <span class="checkout-row-value">${formatMoney(price)}</span>
        </div>
        ${taxFee > 0 ? `
        <div class="checkout-row">
            <span class="checkout-row-label">Thuế nhập khẩu (10%)</span>
            <span class="checkout-row-value" style="color:var(--warning)">${formatMoney(taxFee)}</span>
        </div>
        ` : ''}
        <div class="checkout-row">
            <span class="checkout-row-label">Phí vận chuyển</span>
            <span class="checkout-row-value">${shippingFee === 0 ? '<span style="color:var(--success)">Miễn phí 🎉</span>' : formatMoney(shippingFee)}</span>
        </div>
        <div class="checkout-row">
            <span class="checkout-row-label">🚚 Thời gian giao hàng</span>
            <span class="checkout-row-value">${deliveryDays} ngày</span>
        </div>
        <div id="bnplFeeRow" class="checkout-row hidden">
            <span class="checkout-row-label">Phí BNPL (3%)</span>
            <span class="checkout-row-value" style="color:var(--accent-pink)">${formatMoney(price * BNPL_FEE_RATE)}</span>
        </div>
        <div class="checkout-total">
            <div class="checkout-row">
                <span class="checkout-row-label">Tổng thanh toán</span>
                <span class="checkout-row-value" id="totalDisplay">${formatMoney(price + taxFee + shippingFee)}</span>
            </div>
        </div>
    `;

    // Reset payment method
    document.querySelectorAll('.radio-card').forEach(card => card.classList.remove('active'));
    const defaultCard = document.querySelector('.radio-card[data-value="cod"]');
    if (defaultCard) defaultCard.classList.add('active');
    document.querySelector('input[name="payment"][value="cod"]').checked = true;
    document.getElementById('bnplAlert').classList.add('hidden');
    document.getElementById('bnplFeeRow')?.classList.add('hidden');

    updateTotalDisplay();
    modal.classList.remove('hidden');
}

function updateTotalDisplay() {
    if (!selectedProduct) return;

    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
    const isInternational = selectedProduct.origin === 'INTERNATIONAL';
    const taxFee = isInternational ? selectedProduct.price * IMPORT_TAX_RATE : 0;

    const userSelect = document.getElementById('userSelect');
    const selectedText = userSelect.options[userSelect.selectedIndex]?.text || '';
    const isSubscribed = selectedText.toLowerCase().includes('subscribed') || selectedText.toLowerCase().includes('subscribe');
    const shippingFee = isSubscribed ? 0 : SHIPPING_FEE_DEFAULT;

    let total = selectedProduct.price + taxFee + shippingFee;

    const bnplFeeRow = document.getElementById('bnplFeeRow');
    const bnplAlert = document.getElementById('bnplAlert');

    if (paymentMethod === 'bnpl') {
        const bnplFee = selectedProduct.price * BNPL_FEE_RATE;
        total += bnplFee;
        if (bnplFeeRow) bnplFeeRow.classList.remove('hidden');
        if (bnplAlert) bnplAlert.classList.remove('hidden');
    } else {
        if (bnplFeeRow) bnplFeeRow.classList.add('hidden');
        if (bnplAlert) bnplAlert.classList.add('hidden');
    }

    const totalDisplay = document.getElementById('totalDisplay');
    if (totalDisplay) totalDisplay.textContent = formatMoney(total);
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.add('hidden');
    selectedProduct = null;
}

// ---- Setup Checkout Listeners ----
function setupCheckoutListeners() {
    // Radio card selection
    document.querySelectorAll('.radio-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            card.querySelector('input[type="radio"]').checked = true;
            updateTotalDisplay();
        });
    });

    // Cancel
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeCheckout);
    }

    // Click backdrop to close
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeCheckout();
        });
    }

    // Confirm purchase
    const confirmBtn = document.getElementById('confirmBuyBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handlePurchase);
    }
}

async function handlePurchase() {
    if (!selectedProduct) return;

    const userId = document.getElementById('userSelect').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const confirmBtn = document.getElementById('confirmBuyBtn');

    // Disable button during processing
    confirmBtn.disabled = true;
    confirmBtn.textContent = '⏳ Đang xử lý...';

    try {
        const result = await Api.createOrder(userId, selectedProduct.id, paymentMethod);
        const orderData = result.data || result;

        showToast(`Đặt hàng thành công! Tổng: ${formatMoney(orderData.totalPrice)}${orderData.fraud ? ' ⚠️ (Đơn bị gắn cờ gian lận)' : ''}`, 'success');
        closeCheckout();
    } catch (error) {
        showToast(error.message || 'Đặt hàng thất bại', 'error');
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.textContent = '✅ Xác nhận mua';
    }
}
