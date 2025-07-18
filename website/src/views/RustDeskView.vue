<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <svg class="h-8 w-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">RustDesk Remote Desktop</h1>
              <p class="text-sm text-gray-500">Manage remote desktop connections and devices</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600">{{ onlineDevices }} Online</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600">{{ activeConnections.length }} Active</span>
              </div>
            </div>
            <button
              @click="refreshDevices"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Devices Tab -->
      <div v-if="activeTab === 'devices'" class="space-y-6">
        <!-- Device Grid -->
        <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="device in devices"
            :key="device.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <component :is="getPlatformIcon(device.platform)" class="h-8 w-8 text-gray-600" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-lg font-medium text-gray-900">{{ device.name }}</h3>
                    <p class="text-sm text-gray-500">{{ device.ownerName }}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <div
                    :class="[
                      'w-3 h-3 rounded-full mr-2',
                      device.status === 'online' ? 'bg-green-400' :
                      device.status === 'away' ? 'bg-yellow-400' :
                      device.status === 'busy' ? 'bg-red-400' : 'bg-gray-400'
                    ]"
                  ></div>
                  <span class="text-sm capitalize" :class="getStatusColor(device.status)">
                    {{ device.status }}
                  </span>
                </div>
              </div>

              <div class="space-y-2 mb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">IP Address:</span>
                  <span class="text-gray-900">{{ device.ipAddress }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Platform:</span>
                  <span class="text-gray-900 capitalize">{{ device.platform }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Department:</span>
                  <span class="text-gray-900">{{ device.department }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Last Seen:</span>
                  <span class="text-gray-900">{{ formatLastSeen(device.lastSeen) }}</span>
                </div>
              </div>

              <!-- Permissions -->
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Permissions</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(enabled, permission) in device.permissions"
                    :key="permission"
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ permission }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex space-x-2">
                <button
                  @click="connectToDevice(device.id, 'remote_control')"
                  :disabled="device.status === 'offline'"
                  class="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.121 2.122" />
                  </svg>
                  Connect
                </button>
                <button
                  @click="viewDevice(device)"
                  class="inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>

      <!-- Sessions Tab -->
      <div v-if="activeTab === 'sessions'" class="space-y-6">
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            <li v-for="session in sessions" :key="session.id" class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div
                      :class="[
                        'w-3 h-3 rounded-full',
                        session.status === 'active' ? 'bg-green-400' :
                        session.status === 'ended' ? 'bg-gray-400' : 'bg-red-400'
                      ]"
                    ></div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ session.deviceName }}</p>
                    <p class="text-sm text-gray-500">
                      {{ session.initiatorName }} → {{ session.targetName }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="text-sm text-gray-500">
                    <span class="capitalize">{{ session.sessionType.replace('_', ' ') }}</span>
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatDuration(session.duration) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatDate(session.startTime) }}
                  </div>
                  <div
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      session.status === 'active' ? 'bg-green-100 text-green-800' :
                      session.status === 'ended' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ session.status }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Active Connections Tab -->
      <div v-if="activeTab === 'connections'" class="space-y-6">
        <div v-if="activeConnections.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No active connections</h3>
          <p class="mt-1 text-sm text-gray-500">Connect to a device to see active sessions here.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="connection in activeConnections"
            :key="connection.id"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">{{ connection.deviceName }}</h3>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span class="text-sm text-green-600">Connected</span>
              </div>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Quality:</span>
                <span class="text-gray-900 capitalize">{{ connection.quality }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Latency:</span>
                <span class="text-gray-900">{{ connection.latency }}ms</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Bandwidth:</span>
                <span class="text-gray-900">{{ connection.bandwidth }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Encryption:</span>
                <span class="text-gray-900">{{ connection.encryption ? 'Enabled' : 'Disabled' }}</span>
              </div>
            </div>

            <button
              @click="disconnectFromDevice(connection.id)"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Remote Control Modal -->
    <div v-if="showRemoteControl" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Remote Control - {{ selectedDevice?.name }}</h3>
            <button
              @click="closeRemoteControl"
              class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
          
          <div class="bg-black rounded-lg p-4">
            <div class="text-center text-white">
              <div class="mb-4">
                <svg class="mx-auto h-16 w-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 class="text-xl font-medium mb-2">RustDesk Remote Desktop</h4>
              <p class="text-gray-300 mb-4">Connected to: {{ selectedDevice?.name }}</p>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-400">Platform:</span>
                  <span class="ml-2 capitalize">{{ selectedDevice?.platform }}</span>
                </div>
                <div>
                  <span class="text-gray-400">IP Address:</span>
                  <span class="ml-2">{{ selectedDevice?.ipAddress }}</span>
                </div>
                <div>
                  <span class="text-gray-400">CPU:</span>
                  <span class="ml-2">{{ selectedDevice?.cpu }}</span>
                </div>
                <div>
                  <span class="text-gray-400">Memory:</span>
                  <span class="ml-2">{{ selectedDevice?.memory }}</span>
                </div>
              </div>
              <div class="mt-6 text-gray-400">
                <p>This is a demo remote desktop interface.</p>
                <p>In a production environment, you would see the actual remote desktop here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { rustDeskService, type RustDeskDevice, type RustDeskSession, type RustDeskConnection } from '../services/rustDesk'

const authStore = useAuthStore()
const loading = ref(false)
const devices = ref<RustDeskDevice[]>([])
const sessions = ref<RustDeskSession[]>([])
const activeConnections = ref<RustDeskConnection[]>([])
const showRemoteControl = ref(false)
const selectedDevice = ref<RustDeskDevice | null>(null)

const activeTab = ref('devices')
const tabs = [
  { id: 'devices', name: 'Devices' },
  { id: 'sessions', name: 'Sessions' },
  { id: 'connections', name: 'Active Connections' }
]

const onlineDevices = computed(() => devices.value.filter(d => d.status === 'online').length)

// Initialize RustDesk service with current user
onMounted(async () => {
  if (authStore.user) {
    rustDeskService.setCurrentUser(authStore.user)
  }
  await refreshDevices()
  await loadSessions()
  await loadActiveConnections()
})

const refreshDevices = async () => {
  loading.value = true
  try {
    devices.value = await rustDeskService.getDevices()
  } catch (error) {
    console.error('Failed to load devices:', error)
  } finally {
    loading.value = false
  }
}

const loadSessions = async () => {
  try {
    sessions.value = await rustDeskService.getSessions()
  } catch (error) {
    console.error('Failed to load sessions:', error)
  }
}

const loadActiveConnections = async () => {
  try {
    activeConnections.value = await rustDeskService.getActiveConnections()
  } catch (error) {
    console.error('Failed to load active connections:', error)
  }
}

const connectToDevice = async (deviceId: string, sessionType: 'remote_control' | 'view_only' = 'remote_control') => {
  try {
    const device = devices.value.find(d => d.id === deviceId)
    if (!device) return

    selectedDevice.value = device
    await rustDeskService.connectToDevice(deviceId, sessionType)
    
    if (sessionType === 'remote_control') {
      showRemoteControl.value = true
    }
    
    // Refresh active connections
    await loadActiveConnections()
  } catch (error) {
    console.error('Failed to connect to device:', error)
    alert(`Failed to connect: ${error}`)
  }
}

const disconnectFromDevice = async (connectionId: string) => {
  try {
    await rustDeskService.disconnectFromDevice(connectionId)
    await loadActiveConnections()
  } catch (error) {
    console.error('Failed to disconnect:', error)
  }
}

const viewDevice = (device: RustDeskDevice) => {
  selectedDevice.value = device
  // In a real implementation, this would open device details
  console.log('Viewing device:', device)
}

const closeRemoteControl = () => {
  showRemoteControl.value = false
  selectedDevice.value = null
}

const getPlatformIcon = (platform: string) => {
  const icons = {
    windows: 'svg',
    mac: 'svg',
    linux: 'svg',
    android: 'svg',
    ios: 'svg'
  }
  return icons[platform as keyof typeof icons] || 'svg'
}

const getStatusColor = (status: string) => {
  const colors = {
    online: 'text-green-600',
    offline: 'text-gray-600',
    away: 'text-yellow-600',
    busy: 'text-red-600'
  }
  return colors[status as keyof typeof colors] || 'text-gray-600'
}

const formatLastSeen = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return `${Math.floor(diffMins / 1440)}d ago`
}

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>
