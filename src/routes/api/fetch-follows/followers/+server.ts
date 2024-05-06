import { getFollowers } from "$lib/helpers/data/follow";
import { json } from "@sveltejs/kit";


export const GET = async (request) => {
    const userId = request.locals.session?.userId
    const targetUser = request.url.searchParams.get("userId")


    if(!userId || !targetUser) return json({error:true, message:"Unauthorized"})
    const skip = Number(request.url.searchParams.get("count")) 
    if(isNaN(skip)) return json({error:true, message:"Bad Request"})

    return getFollowers(skip, targetUser)
}