interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
}

interface DiscordGuildMember {
    roles: string[];
}

export class DiscordService {
    // Get the user's basic info (username, discriminator)
    static async getUser(accessToken: string): Promise<DiscordUser> {
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.status}`);
        }

        return await response.json() as DiscordUser;
    }

    // Get the user's roles in a specific guild
    static async getUserRoles(accessToken: string, guildId: string): Promise<string[]> {
        const response = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}/member`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch roles: ${response.status}`);
        }

        const member = await response.json() as DiscordGuildMember;
        return member.roles;
    }
}
