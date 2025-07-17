import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types'

// Demo users database
const demoUsers = [
  {
    id: 'demo-admin-1',
    email: 'admin@company.com',
    password: 'password123',
    name: 'Admin User',
    department: 'Administration',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=blue&color=fff'
  },
  {
    id: 'demo-user-1',
    email: 'user@company.com',
    password: 'password123',
    name: 'John Doe',
    department: 'Engineering',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=green&color=fff'
  },
  {
    id: 'demo-user-2',
    email: 'jane.smith@company.com',
    password: 'password123',
    name: 'Jane Smith',
    department: 'Marketing',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=purple&color=fff'
  },
  {
    id: 'demo-user-3',
    email: 'bob.wilson@company.com',
    password: 'password123',
    name: 'Bob Wilson',
    department: 'Sales',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Wilson&background=orange&color=fff'
  }
]

// Mock authentication service
export class MockAuthService {
  private static instance: MockAuthService
  private currentUser: User | null = null
  private token: string | null = null

  static getInstance(): MockAuthService {
    if (!MockAuthService.instance) {
      MockAuthService.instance = new MockAuthService()
    }
    return MockAuthService.instance
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = demoUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    )

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const token = this.generateToken()
    const authResponse: AuthResponse = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
        avatar: user.avatar
      },
      token,
      refreshToken: `refresh_${token}`
    }

    this.currentUser = authResponse.user
    this.token = token

    // Store in localStorage for persistence
    localStorage.setItem('demo_auth_token', token)
    localStorage.setItem('demo_user_data', JSON.stringify(authResponse.user))

    return authResponse
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Check if user already exists
    const existingUser = demoUsers.find(u => u.email === credentials.email)
    if (existingUser) {
      throw new Error('An account with this email already exists')
    }

    // Create new user
    const newUser = {
      id: `demo-user-${Date.now()}`,
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
      department: credentials.department,
      role: 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.name)}&background=random`
    }

    // Add to demo users (for this session)
    demoUsers.push(newUser)

    const token = this.generateToken()
    const authResponse: AuthResponse = {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        department: newUser.department,
        role: newUser.role,
        avatar: newUser.avatar
      },
      token,
      refreshToken: `refresh_${token}`
    }

    this.currentUser = authResponse.user
    this.token = token

    // Store in localStorage for persistence
    localStorage.setItem('demo_auth_token', token)
    localStorage.setItem('demo_user_data', JSON.stringify(authResponse.user))

    return authResponse
  }

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    this.currentUser = null
    this.token = null

    // Clear localStorage
    localStorage.removeItem('demo_auth_token')
    localStorage.removeItem('demo_user_data')
  }

  async refreshToken(): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    if (!this.currentUser) {
      throw new Error('No user session found')
    }

    const newToken = this.generateToken()
    const authResponse: AuthResponse = {
      user: this.currentUser,
      token: newToken,
      refreshToken: `refresh_${newToken}`
    }

    this.token = newToken
    localStorage.setItem('demo_auth_token', newToken)

    return authResponse
  }

  async getCurrentUser(): Promise<User | null> {
    // Check if we have a stored session
    const storedToken = localStorage.getItem('demo_auth_token')
    const storedUser = localStorage.getItem('demo_user_data')

    if (storedToken && storedUser) {
      try {
        this.token = storedToken
        this.currentUser = JSON.parse(storedUser)
        return this.currentUser
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        this.logout()
      }
    }

    return null
  }

  async socialLogin(provider: string): Promise<AuthResponse> {
    // Simulate social login flow
    await new Promise(resolve => setTimeout(resolve, 1200))

    // For demo purposes, create a user based on the provider
    const socialUser = {
      id: `demo-social-${provider}-${Date.now()}`,
      email: `demo.${provider}@example.com`,
      password: 'social_login',
      name: `Demo ${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      department: 'External',
      role: 'user',
      avatar: `https://ui-avatars.com/api/?name=Demo+${provider}&background=random`
    }

    const token = this.generateToken()
    const authResponse: AuthResponse = {
      user: {
        id: socialUser.id,
        name: socialUser.name,
        email: socialUser.email,
        department: socialUser.department,
        role: socialUser.role,
        avatar: socialUser.avatar
      },
      token,
      refreshToken: `refresh_${token}`
    }

    this.currentUser = authResponse.user
    this.token = token

    // Store in localStorage for persistence
    localStorage.setItem('demo_auth_token', token)
    localStorage.setItem('demo_user_data', JSON.stringify(authResponse.user))

    return authResponse
  }

  private generateToken(): string {
    return `demo_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.currentUser
  }

  getToken(): string | null {
    return this.token
  }

  getUser(): User | null {
    return this.currentUser
  }
}

export const mockAuthService = MockAuthService.getInstance()
