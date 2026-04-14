import NetInfo from '@react-native-community/netinfo'

export type ConnectivityMode = 'online' | 'low' | 'offline'

export async function getConnectivityMode(): Promise<ConnectivityMode> {
  const state = await NetInfo.fetch()
  if (!state.isConnected) return 'offline'
  if (state.type === 'cellular' && state.details?.cellularGeneration === '2g') return 'low'
  return 'online'
}