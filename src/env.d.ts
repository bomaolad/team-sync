declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      [key: string]: string | undefined;
    }
  }
}

export {};
