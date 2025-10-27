const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{
      token: string;
      user: { id: string; email: string; role: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setToken(response.token);
    return response;
  }

  async logout() {
    this.setToken(null);
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request<{ user: { id: string; email: string; role: string } }>('/auth/me');
  }

  // Store endpoints
  async getStores(language: string = 'en') {
    return this.request<Array<{
      id: string;
      name: string;
      location: string;
      createdAt: string;
    }>>(`/stores?language=${language}`);
  }

  async createStore(data: { name: string; location: string; language?: string }) {
    return this.request('/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStore(id: string, data: { name: string; location: string; language?: string }) {
    return this.request(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStore(id: string) {
    return this.request(`/stores/${id}`, {
      method: 'DELETE',
    });
  }

  // Review endpoints
  async submitReview(data: {
    storeId: string;
    rating?: number;
    comment: string;
    language?: string;
  }) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getReviews(language: string = 'en', page: number = 1, limit: number = 10) {
    return this.request<{
      reviews: Array<{
        id: string;
        storeName: string;
        rating: number | null;
        comment: string;
        date: string;
        isApproved: boolean;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/reviews?language=${language}&page=${page}&limit=${limit}`);
  }

  async updateReviewApproval(id: string, isApproved: boolean) {
    return this.request(`/reviews/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ isApproved }),
    });
  }

  async deleteReview(id: string) {
    return this.request(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  // Settings endpoints
  async getSettings() {
    return this.request<{
      webhookUrl: string;
      notificationEmail: string;
      autoApprove: boolean;
      minRating: number;
    }>('/settings');
  }

  async updateSettings(data: {
    webhookUrl?: string;
    notificationEmail?: string;
    autoApprove?: boolean;
    minRating?: number;
  }) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
