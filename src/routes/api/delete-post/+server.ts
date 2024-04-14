import { dbClient } from '$lib/server/db.js'
import { postsTable } from '$lib/server/schema.js'
import { json } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const DELETE = async(request)=>{
    const session = request.locals.session
    const body = await request.request.json()
    const postId = body.postId

    if(!session || !postId){
        return json({error: 'Unauthorized'}, {status: 401})
    }
    
    const row  = (await dbClient.select({author: postsTable.author}).from(postsTable).where(eq(postsTable.id, postId)))[0]

    if(row.author !== session.userId) return json({error: true, message: 'Unauthorized'})

    try{
        await dbClient.delete(postsTable).where(eq(postsTable.id, postId))
        return json({success: true, message: "Post deleted"})
    }
    
    catch(e){
        return json({error: true, message: "An error occured while deleting the post"})
    }   
}