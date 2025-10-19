import { AuthResponse, User, ApiResponse } from '@/types/quiz';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class AuthService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  /**
   * Sign up a new user
   */
  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data: AuthResponse = await response.json();
    
    if (data.success && data.data.token) {
      this.setToken(data.data.token);
    }
    
    return data;
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data: AuthResponse = await response.json();
    
    if (data.success && data.data.token) {
      this.setToken(data.data.token);
    }
    
    return data;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    return response.json();
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Logout user
   */
  logout(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
}

export const authService = new AuthService();
