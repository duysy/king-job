// src/declarations.d.ts
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";

declare interface NodeRequire {
  context: (
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ) => __WebpackModuleApi.RequireContext;
}

// src/declarations.d.ts
declare namespace __WebpackModuleApi {
  interface RequireContext {
    keys: () => string[];
    (id: string): string;
  }
}
