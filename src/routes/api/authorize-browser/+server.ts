import { json } from '@sveltejs/kit'
import { INVITE_KEY } from '$env/static/private';
import { dbClient } from '$lib/server/db.js';
import { authorizedDevicesTable } from '$lib/server/schema.js';

export const POST = async ({request, cookies}) => {
    const body = await request.json();
    
    const token = body.token;

    if(!token){
        return json({error: true, message: "Missing Token"})
    }

    if(token === INVITE_KEY){
        try{
            // copilot moment
            const authToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            await dbClient.insert(authorizedDevicesTable).values({
                deviceToken: authToken
            });

            cookies.set("auth_token", authToken, { path: "/" });
            return json({success:true, message: "Hello, World!"})
        }
        catch(e){
            return json({error: true, message: "An error occured while authorizing the device"})
        }

    }
 
    
}