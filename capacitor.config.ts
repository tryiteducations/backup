import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.tryiteducations.app',
  appName: 'TryIT Educations',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      // Matches the real default theme's brand indigo (Vidya Light) instead of a
      // jarring generic white flash on launch - the #1 tell of an unpolished wrap.
      backgroundColor: '#2D1B69',
      launchAutoHide: false, // hidden manually once the React app has actually mounted
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK', // dark icons/text, since the default theme has a light background
      backgroundColor: '#F5F3FF',
    },
  },
};

export default config;
