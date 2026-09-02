const api = {
  getToken() {
    return localStorage.getItem('token');
  },
  
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers
      });

      if (response.status === 401) {
        this.logout();
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error('API Request error:', err);
      throw err;
    }
  }
};
