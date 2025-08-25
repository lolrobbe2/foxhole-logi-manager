import type { SdkSetupResult } from '../hooks/useDiscordSdk'
import { DiscordSDK, DiscordSDKMock } from '@discord/embedded-app-sdk'
type Role = { id: string; name: string }
class DiscordService {
	private static discordSdk: DiscordSDK | DiscordSDKMock | null = null
	private static context: SdkSetupResult | null = null
	// Set the Discord SDK instance (call once after context is ready)
	public static setSdk(sdk: DiscordSDK | DiscordSDKMock): void {
		DiscordService.discordSdk = sdk
	}

	// Set the Discord context (contains session, accessToken, etc.)
	public static setContext(context: SdkSetupResult): void {
		DiscordService.context = context
	}

	// Check if Discord is connected/authenticated
	public static isConnected(): boolean {
		return !!(DiscordService.discordSdk && DiscordService.context?.authenticated)
	}

	// Optional: get SDK instance
	public static getSdk(): DiscordSDK | DiscordSDKMock | null {
		return DiscordService.discordSdk
	}

	// Get the authenticated user
	public static getUser() {
		return DiscordService.context?.session?.user ?? 'null'
	}
	public static getUserName() {
		return DiscordService.context?.session?.user.username ?? 'null'
	}
	public static getFullUsername() {
		return DiscordService.context?.session?.user.global_name ?? 'null'
	}
	public static getGuildId() {
		return DiscordService.context?.discordSdk.guildId ?? 'null'
	}
	// Get the access token
	public static getAccessToken() {
		return DiscordService.context?.accessToken ?? 'null'
	}

	/**
	 * the user roles
	 * @returns current user roles
	 */
	public static async getUserRoles(): Promise<Role[]> {
		try {
			const guildId: string | null = this.getGuildId()
			const userId: string | undefined = DiscordService.context?.session?.user.id

			if (!guildId || guildId === 'null' || !userId) {
				throw new Error('Missing guildId or userId')
			}

		

			const response = await fetch('/api/users/roles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ guildId, userId })
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || 'Failed to fetch user roles')
			}

			const data = (await response.json()) as { roles?: Array<{ id: string; name: string }> }
			const roles: Role[] = Array.isArray(data.roles)
				? data.roles.map((r) => ({
						id: String(r.id),
						name: String(r.name)
					}))
				: []

			return roles
		} catch (err: any) {
			console.error('Error fetching user roles:', err.message)
			return []
		}
	}

	/**
	 * Checks if the current user is allowed based on required roles.
	 * Accepts role names or IDs. Names are matched case-insensitively.
	 * By default returns true if the user has ANY of the required roles.
	 * Set `requireAll` to true to require ALL roles.
	 */
	public static async allowed(requiredRoles: string[], requireAll: boolean = false): Promise<boolean> {
		try {
			//dev
			//return true;
			const roles: Role[] = await this.getUserRoles()
			if (requiredRoles.length === 0) {
				return true
			}

			const idSet: Set<string> = new Set(roles.map((r) => r.id))
			const nameSetLower: Set<string> = new Set(roles.map((r) => r.name.toLowerCase()))

			const hasMatch = (needle: string): boolean => {
				const n = needle.trim()
				if (n.length === 0) {
					return false
				}
				return idSet.has(n) || nameSetLower.has(n.toLowerCase())
			}

			if (requireAll) {
				return requiredRoles.every(hasMatch)
			}
			return requiredRoles.some(hasMatch)
		} catch (err: any) {
			console.error('Error checking roles:', err.message)
			return false
		}
	}
}

export default DiscordService
