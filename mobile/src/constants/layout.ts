import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

// OnePlus Nord 5 = 412x917
export const W = width
export const H = height
export const IS_TALL = H / W > 2.0
export const IS_SMALL = W < 390

export const layout = {
  w: W,
  h: H,
  ph: 20,              // padding horizontal
  pv: IS_TALL ? 16 : 12, // padding vertical
  cardGap: 10,
  borderRadius: 16,
  headerHeight: 60,
  navHeight: IS_TALL ? 80 : 64,
}

export const fs = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: IS_TALL ? 26 : 22,
}