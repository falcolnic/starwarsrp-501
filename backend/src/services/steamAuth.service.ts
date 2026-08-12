const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";

export function buildSteamLoginUrl(backendOrigin: string): string {
    const returnTo = `${backendOrigin}/api/auth/steam/callback`;

    const params = new URLSearchParams({
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": returnTo,
        "openid.realm": backendOrigin, // MUST match the domain and port of return_to
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    });

    return `${STEAM_OPENID_URL}?${params.toString()}`;
}

export async function verifySteamCallback(rawQuery: string): Promise<string | null> {
    const params = new URLSearchParams(rawQuery);
    params.set("openid.mode", "check_authentication");

    const res = await fetch(STEAM_OPENID_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    });

    const text = await res.text();
    if (!text.includes("is_valid:true")) {
        return null;
    }

    const claimedId = params.get("openid.claimed_id") ?? "";
    const match = claimedId.match(/\/id\/(\d+)$/);
    return match ? match[1] : null;
}

export async function fetchSteamProfile(steamId: string): Promise<{ personaName: string; avatar: string } | null> {
    const apiKey = process.env.STEAM_API_KEY;
    if (!apiKey) return null;

    try {
        const res = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`
        );
        const data = await res.json();
        const player = data?.response?.players?.[0];
        if (!player) return null;

        return { personaName: player.personaname, avatar: player.avatarfull };
    } catch {
        return null;
    }
}
