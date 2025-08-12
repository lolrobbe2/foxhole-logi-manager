export {}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_OPTIONS: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_CLIENT_SECRET: string;
      VITE_DISCORD_CLIENT_ID: string;
      PORT: string;
      VITE_BASE_URL: "https://lolrobbe2.github.io/foxhole-logi-manager/";
    }
  }
}