import { getPosts } from "$lib/helpers/data/posts"
import { error, json } from "@sveltejs/kit"

export const GET = async ({url}) => {
    const skip = Number(url.searchParams.get("count")) 
    if(isNaN(skip)) return json({error:true, message:"Bad Request"})

    const rows = await getPosts(skip)
    if(rows.length === 0) return json({error:true, message:"No more posts"})
    return json({success: true, data: rows})

}