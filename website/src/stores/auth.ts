import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterCredentials, AuthResponse, AuthError } from '../types'
import { apiService } from '../services/api'
import { supabase } from '../lib/supabase'
import { mockAuthService } from '../services/mockAuth'
import { useLoadingStore } from './loading'

export const useAuthStore = defineStore('auth', () => {
  // Get loading store instance
  const loadingStore = useLoadingStore()
  
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const error = ref<AuthError | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const userDepartment = computed(() => user.value?.department || null)
  const isLoading = computed(() => loadingStore.isAuthLoading)

  // Actions
  const setAuthData = (authData: AuthResponse) => {
    user.value = authData.user
    token.value = authData.token
    refreshToken.value = authData.refreshToken
    
    // Persist to localStorage
    localStorage.setItem('auth_token', authData.token)
    localStorage.setItem('refresh_token', authData.refreshToken)
    localStorage.setItem('user_data', JSON.stringify(authData.user))
    
    // Set API token
    apiService.setAuthToken(authData.token)
  }

  const clearAuthData = () => {
    user.value = null
    token.value = null
    refreshToken.value = null
    
    // Clear localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    
    // Remove API token
    apiService.removeAuthToken()
  }

  const setError = (authError: AuthError | null) => {
    error.value = authError
  }

  const clearError = () => {
    error.value = null
  }

  // Login action
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    loadingStore.startAuthLoading('Signing in...')
    clearError()
    
    try {
      if (!supabase) {
        // Use mock authentication service when Supabase is not configured
        const authResponse = await mockAuthService.login(credentials)
        setAuthData(authResponse)
        return true
      }
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
      
      if (error) {
        setError({ message: error.message })
        return false
      }
      
      if (data.user && data.session) {
        // Fetch user profile from database
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        if (profileError) {
          console.error('Profile fetch error:', profileError)
        }
        
        // Set auth data
        setAuthData({
          user: {
            id: data.user.id,
            name: profile?.full_name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email!,
            department: profile?.department || 'General',
            role: profile?.role || 'user',
            avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || data.user.email!)}&background=random`
          },
          token: data.session.access_token,
          refreshToken: data.session.refresh_token
        })
        return true
      }
      
      return false
    } catch (err: any) {
      setError({ message: err.message || 'Login failed. Please try again.' })
      return false
    } finally {
      loadingStore.stopLoading('auth')
    }
  }

  // Register action
  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    loadingStore.startAuthLoading('Creating account...')
    clearError()

    try {
      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        setError({ field: 'confirmPassword', message: 'Passwords do not match' })
        return false
      }

      if (!supabase) {
        // Use mock authentication service when Supabase is not configured
        const authResponse = await mockAuthService.register(credentials)
        setAuthData(authResponse)
        return true
      }

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      })
      
      if (error) {
        setError({ message: error.message })
        return false
      }
      
      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            full_name: credentials.name,
            email: credentials.email,
            department: credentials.department,
            role: 'user',
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.name)}&background=random`
          })
        
        if (profileError) {
          console.error('Profile creation error:', profileError)
        }
        
        // If session exists (email confirmation disabled), set auth data
        if (data.session) {
          setAuthData({
            user: {
              id: data.user.id,
              name: credentials.name,
              email: credentials.email,
              department: credentials.department,
              role: 'user',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.name)}&background=random`
            },
            token: data.session.access_token,
            refreshToken: data.session.refresh_token
          })
          return true
        } else {
          // Email confirmation required
          setError({ message: 'Please check your email to confirm your account.' })
          return true // Still return true as signup was successful
        }
      }
      
      return false
    } catch (err: any) {
      setError({ message: err.message || 'Registration failed. Please try again.' })
      return false
    } finally {
      loadingStore.stopLoading('auth')
    }
  }

  // Logout action
  const logout = async () => {
    loadingStore.startAuthLoading('Signing out...')
    
    try {
      if (!supabase) {
        // Use mock authentication service when Supabase is not configured
        await mockAuthService.logout()
        clearAuthData()
        clearError()
        return
      }
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Logout error:', error)
      }
      
      clearAuthData()
      clearError()
    } catch (err) {
      console.error('Logout error:', err)
      // Clear local data even if server call fails
      clearAuthData()
    } finally {
      loadingStore.stopLoading('auth')
    }
  }

// Social Login actions
const socialLogin = async (provider: string) => {
  loadingStore.startAuthLoading(`Signing in with ${provider}...`)
  clearError()

  try {
    if (!supabase) {
      // Use mock authentication service for social login
      const authResponse = await mockAuthService.socialLogin(provider)
      setAuthData(authResponse)
      return
    }
    
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: provider as any,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    if (error) setError({ message: error.message })
  } catch (err: any) {
    setError({ message: err.message || 'Social login failed. Please try again.' })
  } finally {
    loadingStore.stopLoading('auth')
  }
}

// Refresh token action
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      if (!supabase) {
        // Use mock authentication service
        const authResponse = await mockAuthService.refreshToken()
        setAuthData(authResponse)
        return true
      }
      
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Token refresh failed:', error)
        clearAuthData()
        return false
      }
      
      if (data.session && data.user) {
        // Fetch updated user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        setAuthData({
          user: {
            id: data.user.id,
            name: profile?.full_name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email!,
            department: profile?.department || 'General',
            role: profile?.role || 'user',
            avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || data.user.email!)}&background=random`
          },
          token: data.session.access_token,
          refreshToken: data.session.refresh_token
        })
        return true
      }
      
      return false
    } catch (err) {
      console.error('Token refresh failed:', err)
      clearAuthData()
      return false
    }
  }

  // Initialize auth from localStorage
  const initializeAuth = async () => {
    try {
      if (!supabase) {
        // Use mock authentication service
        const currentUser = await mockAuthService.getCurrentUser()
        if (currentUser) {
          // Restore session from mock service
          const mockToken = mockAuthService.getToken()
          if (mockToken) {
            user.value = currentUser
            token.value = mockToken
            refreshToken.value = `refresh_${mockToken}`
            apiService.setAuthToken(mockToken)
          }
        }
        return
      }
      
      // Get the current session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session initialization error:', error)
        clearAuthData()
        return
      }
      
      if (session) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        setAuthData({
          user: {
            id: session.user.id,
            name: profile?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email!,
            department: profile?.department || 'General',
            role: profile?.role || 'user',
            avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || session.user.email!)}&background=random`
          },
          token: session.access_token,
          refreshToken: session.refresh_token
        })
      }
      
      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Fetch user profile
          const { data: profile } = await supabase!
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setAuthData({
            user: {
              id: session.user.id,
              name: profile?.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email!,
              department: profile?.department || 'General',
              role: profile?.role || 'user',
              avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || session.user.email!)}&background=random`
            },
            token: session.access_token,
            refreshToken: session.refresh_token
          })
        } else if (event === 'SIGNED_OUT') {
          clearAuthData()
        }
      })
    } catch (err) {
      console.error('Auth initialization failed:', err)
      clearAuthData()
    }
  }

  // Check if user has specific role
  const hasRole = (role: string): boolean => {
    return user.value?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: string[]): boolean => {
    return user.value ? roles.includes(user.value.role) : false
  }

  return {
    // State
    user: computed(() => user.value),
    token: computed(() => token.value),
    refreshToken: computed(() => refreshToken.value),
    isLoading,
    error: computed(() => error.value),
    
    // Getters
    isAuthenticated,
    userRole,
    userDepartment,
    
    // Actions
    login,
    register,
    logout,
    socialLogin,
    refreshAccessToken,
    initializeAuth,
    clearError,
    hasRole,
    hasAnyRole,
  }
})
