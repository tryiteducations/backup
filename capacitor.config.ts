import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId:   'net.tryiteducations.app',
  appName: 'TryIT Educations',
  webDir:  'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*.tryiteducations.net'],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0F2140',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0F2140',
    },
  },
}
export default config
