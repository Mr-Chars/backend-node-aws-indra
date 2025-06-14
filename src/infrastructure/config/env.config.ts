export class EnvConfig {
  private readonly envConfig: { [key: string]: string | undefined };

  constructor() {
    this.envConfig = process.env;
  }

  get<T>(key: string): T{
    return this.envConfig[key] as T;
  }
}