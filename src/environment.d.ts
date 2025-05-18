declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    STANDALONE_SERVER?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
  }
} 