import { dbClient } from '$lib/server/db.js'
import { postsTable } from '$lib/server/schema.js'
import { json } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const GET = async(request)=>{
    const session = request.locals.session
    const postId = request.url.searchParams.get("postId")

    if(!session || !postId){
        return json({error: 'Unauthorized'}, {status: 401})
    }

    const row  = (await dbClient.select({author: postsTable.author}).from(postsTable).where(eq(postsTable.id, postId)))[0]

    return json({sucess: true, ownsPost: row.author === session.userId})
}