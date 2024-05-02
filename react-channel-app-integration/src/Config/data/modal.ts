export interface IMaping  {
    channel: string;
    keyName: string;
    iguardEnvironment: string;
  }
  export interface ImappingEnv {
    local:IMaping[];
    development:IMaping[];
    integration:IMaping[];
    preproduction:IMaping[];
    production:IMaping[];
  }