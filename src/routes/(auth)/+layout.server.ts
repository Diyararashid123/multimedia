import { dbClient } from '$lib/server/db.js';
import { authorizedDevicesTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load = async ({cookies}) =>{
    const _cookies = cookies.get("auth_token");  
    if(!_cookies) return {authorized: false}

    const tokens = await dbClient.select().from(authorizedDevicesTable).where(eq(authorizedDevicesTable.deviceToken, _cookies));

    return{
        authorized: tokens.length > 0
    }
    
}