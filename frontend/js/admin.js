/* ===================================
   Admin Dashboard Logic
   =================================== */

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
    initAdminPage();
});

async function initAdminPage() {
    await loadDashboardData();
}

// ---- Load Dashboard Data ----
async function loadDashboardData() {
    try {
        // Load stats and fraud orders in parallel
        const [stats, fraudOrders] = await Promise.all([
            Api.getStats(),
            Api.getFraudOrders()
        ]);

        renderStats(stats);
        renderFraudOrders(fraudOrders);
    } catch (error) {
        console.error('Error loading admin data:', error);
        showToast('Failed to load dashboard data. Make sure the backend is running.', 'error');
    }
}

// ---- Render Stats Cards ----
function renderStats(stats) {
    const commissionEl = document.getElementById('totalCommission');
    const bnplEl = document.getElementById('totalBnplInterest');
    const fraudEl = document.getElementById('totalFraudOrders');

    if (commissionEl) {
        animateValue(commissionEl, stats.totalCommission, true);
    }
    if (bnplEl) {
        animateValue(bnplEl, stats.totalBnplInterest, true);
    }
    if (fraudEl) {
        fraudEl.textContent = stats.totalFraudOrders;
    }

    // Update fraud count badge
    const fraudCount = document.getElementById('fraudCountBadge');
    if (fraudCount) {
        fraudCount.textContent = stats.totalFraudOrders;
        if (stats.totalFraudOrders === 0) {
            fraudCount.style.display = 'none';
        }
    }
}

// ---- Animate Number Value ----
function animateValue(element, targetValue, isCurrency) {
    const duration = 800;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = start + (targetValue - start) * eased;

        element.textContent = isCurrency ? formatMoney(currentValue) : Math.round(currentValue);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ---- Render Fraud Orders Table ----
function renderFraudOrders(orders) {
    const tbody = document.getElementById('fraudTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (orders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5">
                <div class="fraud-empty">
                    <div class="fraud-empty-icon">🛡️</div>
                    <p class="fraud-empty-text">No fraud orders detected</p>
                </div>
            </td>
        `;
        tbody.appendChild(row);
        return;
    }

    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.style.animation = `fadeInUp 0.3s ease-out ${index * 0.05}s backwards`;

        const statusClass = order.status === 'PENDING' ? 'status-pending'
            : order.status === 'APPROVED' ? 'status-approved'
            : 'status-rejected';

        const statusIcon = order.status === 'PENDING' ? '🔄'
            : order.status === 'APPROVED' ? '✅'
            : '❌';

        row.innerHTML = `
            <td><strong>#${order.id}</strong></td>
            <td>User #${order.buyerId}</td>
            <td>${formatMoney(order.totalPrice)}</td>
            <td>
                <span class="status-badge ${statusClass}">
                    ${statusIcon} ${order.status}
                </span>
            </td>
            <td>
                ${order.status === 'PENDING' ? `
                    <div class="table-actions">
                        <button class="btn btn-success btn-sm" id="approveBtn-${order.id}" onclick="handleFraudAction(${order.id}, 'approve')">
                            ✅ Duyệt
                        </button>
                        <button class="btn btn-danger btn-sm" id="rejectBtn-${order.id}" onclick="handleFraudAction(${order.id}, 'reject')">
                            ❌ Hủy
                        </button>
                    </div>
                ` : `<span class="processed-text">Đã xử lý</span>`}
            </td>
        `;

        tbody.appendChild(row);
    });
}

// ---- Handle Fraud Action (Approve/Reject) ----
async function handleFraudAction(orderId, action) {
    try {
        if (action === 'approve') {
            await Api.approveOrder(orderId);
            showToast(`Đơn hàng #${orderId} đã được duyệt`, 'success');
        } else {
            await Api.rejectOrder(orderId);
            showToast(`Đơn hàng #${orderId} đã bị hủy`, 'warning');
        }

        // Reload data
        await loadDashboardData();
    } catch (error) {
        console.error('Error handling fraud action:', error);
        showToast(`Lỗi xử lý đơn hàng #${orderId}`, 'error');
    }
}
