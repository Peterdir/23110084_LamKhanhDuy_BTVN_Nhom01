/* ===================================
   API Layer — All Backend Calls
   =================================== */

const Api = {
    // ---- Products ----
    async getProducts() {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to load products');
        return response.json();
    },

    async getSimilarProducts(productId) {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/similar`);
        if (!response.ok) throw new Error('Failed to load similar products');
        return response.json();
    },

    // ---- Users ----
    async getUsers() {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error('Failed to load users');
        return response.json();
    },

    // ---- Orders ----
    async createOrder(buyerId, productId, paymentMethod) {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ buyerId, productId, paymentMethod })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || result.error || 'Failed to create order');
        }
        return result;
    },

    // ---- Admin ----
    async getStats() {
        const response = await fetch(`${API_BASE_URL}/admin/stats`);
        if (!response.ok) throw new Error('Failed to load stats');
        return response.json();
    },

    async getFraudOrders() {
        const response = await fetch(`${API_BASE_URL}/admin/fraud-orders`);
        if (!response.ok) throw new Error('Failed to load fraud orders');
        return response.json();
    },

    async approveOrder(orderId) {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/approve`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Failed to approve order');
        return response.json();
    },

    async rejectOrder(orderId) {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/reject`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Failed to reject order');
        return response.json();
    }
};
