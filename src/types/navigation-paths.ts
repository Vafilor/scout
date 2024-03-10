import { NavigationPath } from "app/navigation-paths/types";

export interface INavigationPathAPI {
    get(): Promise<NavigationPath[]>;
    update(options: NavigationPath[]): Promise<void>;
}