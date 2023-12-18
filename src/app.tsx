import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import FileSystemClient from './services/filesystem-client';
import PathFileBrowser from './components/file-browser/file-browser';
import PathClient, { IxPathClient, WindowsPathClient } from "./services/path";
import { IFilesystemAPI } from './types/filesystem';
import { IConfigurationAPI } from './types/configuration';
import Configuration from './services/configuration';
import { IEnvironmentAPI } from './types/environment';

declare global {
    // eslint-disable-next-line no-unused-vars
    interface Window {
        appFilesystem: IFilesystemAPI;
        appConfig: IConfigurationAPI;
        environment: IEnvironmentAPI;
    }
}

FileSystemClient.init(window.appFilesystem);
Configuration.init(window.appConfig);
PathClient.init(window.environment.platform === "win32" ? new WindowsPathClient() : new IxPathClient());

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("HTML Root element not found, unable to initiate app");
}

createRoot(rootElement).render(
    <StrictMode>
        <PathFileBrowser />
    </StrictMode>
);