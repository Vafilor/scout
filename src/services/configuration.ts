import { ConfigurationOptions } from "app/configuration/store";
import { IConfigurationAPI } from "app/types/configuration";

export default class Configuration {
    private static _instance: Configuration | null;
    public static init(configServer: IConfigurationAPI): Configuration {
        if (!Configuration._instance) {
            Configuration._instance = new Configuration(configServer);
        }

        return Configuration._instance;
    }

    static get instance(): Configuration {
        if (!Configuration._instance) {
            throw new Error("Configuration has not been initialized. Call Configuration.init(...) first");
        }

        return Configuration._instance;
    }

    private constructor(private configServer: IConfigurationAPI) {
    }

    getOptions(): Promise<ConfigurationOptions> {
        return this.configServer.getOptions();
    }

    updateOptions(options: Partial<ConfigurationOptions>): Promise<void> {
        return this.configServer.updateOptions(options);
    }
}