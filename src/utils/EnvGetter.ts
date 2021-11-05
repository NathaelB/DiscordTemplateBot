import { Application } from "@discord-factory/core-next";

type EnvConfig = {
    id: string
}

export default class EnvGetter {

    public static getRole (name: string): string {
        const roles = Application.getEnvironment()['ROLES'] as EnvConfig
        console.log(roles)
        return roles[name]
    }

    public static getChannel (name: string): string {
        const channels = Application.getEnvironment()['CHANNELS'] as EnvConfig
        return channels[name]
    }

    public static getCategory (name: string): string {
        const category = Application.getEnvironment()['CATEGORY'] as EnvConfig
        return category[name]
    }
}