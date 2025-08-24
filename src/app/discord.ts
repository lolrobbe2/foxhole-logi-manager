import type { SdkSetupResult } from '../hooks/useDiscordSdk';
import { DiscordSDK, DiscordSDKMock } from '@discord/embedded-app-sdk';

class DiscordService {
    private static discordSdk: DiscordSDK | DiscordSDKMock | null = null;
    private static context: SdkSetupResult | null = null;

    // Set the Discord SDK instance (call once after context is ready)
    public static setSdk(sdk: DiscordSDK | DiscordSDKMock): void {
        DiscordService.discordSdk = sdk;
    }

    // Set the Discord context (contains session, accessToken, etc.)
    public static setContext(context: SdkSetupResult): void {
        DiscordService.context = context;
    }
    

    // Check if Discord is connected/authenticated
    public static isConnected(): boolean {
        return !!(DiscordService.discordSdk && DiscordService.context?.authenticated);
    }

    // Optional: get SDK instance
    public static getSdk(): DiscordSDK | DiscordSDKMock | null {
        return DiscordService.discordSdk;
    }

    // Get the authenticated user
    public static getUser() {
        return DiscordService.context?.session?.user ?? 'null';
    }
    public static getUserName() {
        return DiscordService.context?.session?.user.username ?? 'null';
    }
    public static getFullUsername() {
      return DiscordService.context?.session?.user.global_name ?? 'null';
    }
    public static getGuildId() {
        return DiscordService.context?.discordSdk.guildId ?? 'null';
    }
    // Get the access token
    public static getAccessToken() {
        return DiscordService.context?.accessToken ?? 'null';
    }
    public static async getUserRoles(): Promise<string[]> {
        const endpoint = `/users/@me/guilds/${this.getGuildId()}/member`

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
            'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to fetch roles: ${errorText}`)
        }

        const data = await response.json()
        return data.roles ?? []
        }


    }

export default DiscordService;
