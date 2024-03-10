import { NavigationPath } from "app/navigation-paths/types";
import { INavigationPathAPI } from "app/types/navigation-paths";

export default class NavigationPaths {
    private static _instance: NavigationPaths | null;
    public static init(navigationPathServer: INavigationPathAPI): NavigationPaths {
        if (!NavigationPaths._instance) {
            NavigationPaths._instance = new NavigationPaths(navigationPathServer);
        }

        return NavigationPaths._instance;
    }

    static get instance(): NavigationPaths {
        if (!NavigationPaths._instance) {
            throw new Error("NavigationPaths has not been initialized. Call NavigationPaths.init(...) first");
        }

        return NavigationPaths._instance;
    }

    private constructor(private configServer: INavigationPathAPI) {
    }

    get(): Promise<NavigationPath[]> {
        return this.configServer.get();
    }

    update(options: NavigationPath[]): Promise<void> {
        return this.configServer.update(options);
    }
}