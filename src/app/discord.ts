class DiscordService {
  private static discordSdk: any = null;

  // Set the Discord SDK instance (call this once after you have the SDK)
  public static setSdk(sdk: any): void {
    DiscordService.discordSdk = sdk;
  }

  // Check if Discord is connected/authenticated
  public static isConnected(): boolean {
    if (DiscordService.discordSdk == null) {
      return false;
    }
    // Adjust these checks depending on your SDK properties
    return true;
  }

  // Optional: get SDK instance
  public static getSdk(): any {
    return DiscordService.discordSdk;
  }
}

export default DiscordService;
