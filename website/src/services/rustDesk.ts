import type { User } from '../types'

export interface RustDeskDevice {
  id: string
  name: string
  platform: 'windows' | 'mac' | 'linux' | 'android' | 'ios'
  status: 'online' | 'offline' | 'busy' | 'away'
  ipAddress: string
  lastSeen: Date
  owner: string
  ownerName: string
  department: string
  version: string
  cpu: string
  memory: string
  permissions: {
    screen: boolean
    keyboard: boolean
    clipboard: boolean
    fileTransfer: boolean
    audio: boolean
  }
}

export interface RustDeskSession {
  id: string
  deviceId: string
  deviceName: string
  initiatorId: string
  initiatorName: string
  targetId: string
  targetName: string
  startTime: Date
  endTime?: Date
  duration: number
  status: 'active' | 'ended' | 'failed'
  sessionType: 'remote_control' | 'view_only' | 'file_transfer'
  permissions: string[]
}

export interface RustDeskConnection {
  id: string
  deviceId: string
  deviceName: string
  platform: string
  status: 'connecting' | 'connected' | 'disconnected' | 'error'
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  latency: number
  bandwidth: string
  encryption: boolean
}

// Mock RustDesk devices for demonstration
const mockDevices: RustDeskDevice[] = [
  {
    id: 'rd-001',
    name: 'Admin-Desktop-01',
    platform: 'windows',
    status: 'online',
    ipAddress: '192.168.1.100',
    lastSeen: new Date(),
    owner: 'demo-admin-1',
    ownerName: 'Admin User',
    department: 'Administration',
    version: '1.2.3',
    cpu: 'Intel Core i7-12700K',
    memory: '32GB',
    permissions: {
      screen: true,
      keyboard: true,
      clipboard: true,
      fileTransfer: true,
      audio: true
    }
  },
  {
    id: 'rd-002',
    name: 'Engineering-Workstation-01',
    platform: 'linux',
    status: 'online',
    ipAddress: '192.168.1.101',
    lastSeen: new Date(Date.now() - 5 * 60 * 1000),
    owner: 'demo-user-1',
    ownerName: 'John Doe',
    department: 'Engineering',
    version: '1.2.3',
    cpu: 'AMD Ryzen 9 5900X',
    memory: '64GB',
    permissions: {
      screen: true,
      keyboard: true,
      clipboard: true,
      fileTransfer: true,
      audio: false
    }
  },
  {
    id: 'rd-003',
    name: 'Marketing-MacBook-Pro',
    platform: 'mac',
    status: 'away',
    ipAddress: '192.168.1.102',
    lastSeen: new Date(Date.now() - 15 * 60 * 1000),
    owner: 'demo-user-2',
    ownerName: 'Jane Smith',
    department: 'Marketing',
    version: '1.2.3',
    cpu: 'Apple M2 Pro',
    memory: '16GB',
    permissions: {
      screen: true,
      keyboard: false,
      clipboard: true,
      fileTransfer: true,
      audio: true
    }
  },
  {
    id: 'rd-004',
    name: 'Sales-Laptop-Surface',
    platform: 'windows',
    status: 'offline',
    ipAddress: '192.168.1.103',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    owner: 'demo-user-3',
    ownerName: 'Bob Wilson',
    department: 'Sales',
    version: '1.2.2',
    cpu: 'Intel Core i5-11400H',
    memory: '16GB',
    permissions: {
      screen: true,
      keyboard: true,
      clipboard: false,
      fileTransfer: true,
      audio: true
    }
  },
  {
    id: 'rd-005',
    name: 'Mobile-Device-Android',
    platform: 'android',
    status: 'online',
    ipAddress: '192.168.1.104',
    lastSeen: new Date(Date.now() - 1 * 60 * 1000),
    owner: 'demo-user-2',
    ownerName: 'Jane Smith',
    department: 'Marketing',
    version: '1.2.1',
    cpu: 'Snapdragon 8 Gen 2',
    memory: '12GB',
    permissions: {
      screen: true,
      keyboard: false,
      clipboard: true,
      fileTransfer: false,
      audio: false
    }
  }
]

let mockSessions: RustDeskSession[] = [
  {
    id: 'session-001',
    deviceId: 'rd-001',
    deviceName: 'Admin-Desktop-01',
    initiatorId: 'demo-admin-1',
    initiatorName: 'Admin User',
    targetId: 'demo-user-1',
    targetName: 'John Doe',
    startTime: new Date(Date.now() - 30 * 60 * 1000),
    endTime: new Date(Date.now() - 15 * 60 * 1000),
    duration: 15 * 60 * 1000,
    status: 'ended',
    sessionType: 'remote_control',
    permissions: ['screen', 'keyboard', 'clipboard']
  },
  {
    id: 'session-002',
    deviceId: 'rd-002',
    deviceName: 'Engineering-Workstation-01',
    initiatorId: 'demo-user-2',
    initiatorName: 'Jane Smith',
    targetId: 'demo-user-1',
    targetName: 'John Doe',
    startTime: new Date(Date.now() - 5 * 60 * 1000),
    duration: 5 * 60 * 1000,
    status: 'active',
    sessionType: 'view_only',
    permissions: ['screen']
  }
]

export class RustDeskService {
  private static instance: RustDeskService
  private currentUser: User | null = null
  private connections: Map<string, RustDeskConnection> = new Map()

  static getInstance(): RustDeskService {
    if (!RustDeskService.instance) {
      RustDeskService.instance = new RustDeskService()
    }
    return RustDeskService.instance
  }

  setCurrentUser(user: User) {
    this.currentUser = user
  }

  async getDevices(): Promise<RustDeskDevice[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Filter devices based on user permissions
    if (this.currentUser?.role === 'admin') {
      return mockDevices
    } else {
      // Regular users can only see their own devices and those they have permission to access
      return mockDevices.filter(device => 
        device.owner === this.currentUser?.id ||
        device.department === this.currentUser?.department
      )
    }
  }

  async getDeviceById(deviceId: string): Promise<RustDeskDevice | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockDevices.find(device => device.id === deviceId) || null
  }

  async connectToDevice(deviceId: string, sessionType: 'remote_control' | 'view_only' | 'file_transfer' = 'remote_control'): Promise<RustDeskConnection> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const device = mockDevices.find(d => d.id === deviceId)
    if (!device) {
      throw new Error('Device not found')
    }

    if (device.status === 'offline') {
      throw new Error('Device is offline')
    }

    const connection: RustDeskConnection = {
      id: `conn-${Date.now()}`,
      deviceId: device.id,
      deviceName: device.name,
      platform: device.platform,
      status: 'connecting',
      quality: 'good',
      latency: Math.floor(Math.random() * 100) + 20,
      bandwidth: '10 Mbps',
      encryption: true
    }

    this.connections.set(connection.id, connection)

    // Simulate connection establishment
    setTimeout(() => {
      connection.status = 'connected'
      this.connections.set(connection.id, connection)
    }, 2000)

    // Create session record
    const session: RustDeskSession = {
      id: `session-${Date.now()}`,
      deviceId: device.id,
      deviceName: device.name,
      initiatorId: this.currentUser?.id || 'unknown',
      initiatorName: this.currentUser?.name || 'Unknown User',
      targetId: device.owner,
      targetName: device.ownerName,
      startTime: new Date(),
      duration: 0,
      status: 'active',
      sessionType,
      permissions: Object.keys(device.permissions).filter(key => 
        device.permissions[key as keyof typeof device.permissions]
      )
    }

    mockSessions.push(session)

    return connection
  }

  async disconnectFromDevice(connectionId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const connection = this.connections.get(connectionId)
    if (connection) {
      connection.status = 'disconnected'
      this.connections.set(connectionId, connection)
      
      // Update session
      const session = mockSessions.find(s => s.deviceId === connection.deviceId && s.status === 'active')
      if (session) {
        session.status = 'ended'
        session.endTime = new Date()
        session.duration = session.endTime.getTime() - session.startTime.getTime()
      }
    }
  }

  async getActiveConnections(): Promise<RustDeskConnection[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return Array.from(this.connections.values()).filter(conn => conn.status === 'connected')
  }

  async getSessions(limit: number = 50): Promise<RustDeskSession[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Filter sessions based on user permissions
    let filteredSessions = mockSessions
    
    if (this.currentUser?.role !== 'admin') {
      filteredSessions = mockSessions.filter(session => 
        session.initiatorId === this.currentUser?.id ||
        session.targetId === this.currentUser?.id
      )
    }

    return filteredSessions
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit)
  }

  async updateDevicePermissions(deviceId: string, permissions: Partial<RustDeskDevice['permissions']>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const device = mockDevices.find(d => d.id === deviceId)
    if (!device) {
      throw new Error('Device not found')
    }

    // Only device owner or admin can update permissions
    if (device.owner !== this.currentUser?.id && this.currentUser?.role !== 'admin') {
      throw new Error('Insufficient permissions')
    }

    Object.assign(device.permissions, permissions)
  }

  async sendFileToDevice(deviceId: string, file: File): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const device = mockDevices.find(d => d.id === deviceId)
    if (!device) {
      throw new Error('Device not found')
    }

    if (!device.permissions.fileTransfer) {
      throw new Error('File transfer not permitted on this device')
    }

    // Simulate file transfer
    console.log(`File ${file.name} sent to ${device.name}`)
  }

  async getDeviceScreenshot(deviceId: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const device = mockDevices.find(d => d.id === deviceId)
    if (!device) {
      throw new Error('Device not found')
    }

    if (!device.permissions.screen) {
      throw new Error('Screen access not permitted on this device')
    }

    // Return a placeholder screenshot (base64 encoded 1x1 pixel)
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  }

  async restartDevice(deviceId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const device = mockDevices.find(d => d.id === deviceId)
    if (!device) {
      throw new Error('Device not found')
    }

    // Only admin or device owner can restart
    if (device.owner !== this.currentUser?.id && this.currentUser?.role !== 'admin') {
      throw new Error('Insufficient permissions')
    }

    // Simulate restart
    device.status = 'offline'
    setTimeout(() => {
      device.status = 'online'
      device.lastSeen = new Date()
    }, 10000)
  }

  async getConnectionQuality(connectionId: string): Promise<{ quality: string; latency: number; bandwidth: string }> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const connection = this.connections.get(connectionId)
    if (!connection) {
      throw new Error('Connection not found')
    }

    return {
      quality: connection.quality,
      latency: connection.latency,
      bandwidth: connection.bandwidth
    }
  }

  // WebRTC-style remote control simulation
  async startRemoteControl(deviceId: string): Promise<MediaStream> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // This would normally establish a WebRTC connection
    // For demo purposes, we'll return a mock stream
    const canvas = document.createElement('canvas')
    canvas.width = 1920
    canvas.height = 1080
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#00ff00'
      ctx.font = '48px Arial'
      ctx.fillText('RustDesk Remote Desktop', 100, 100)
      ctx.fillText(`Connected to: ${deviceId}`, 100, 200)
    }

    return canvas.captureStream()
  }
}

export const rustDeskService = RustDeskService.getInstance()
