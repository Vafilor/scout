import { ConfigurationOptions } from "../configuration/store";

export interface IConfigurationAPI {
    getOptions(): Promise<ConfigurationOptions>;
    updateOptions(options: Partial<ConfigurationOptions>): Promise<void>;
}