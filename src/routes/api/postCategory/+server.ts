// src/routes/api/posts/+server.js
import { dbClient } from "$lib/server/db";
import { postsTable, categoriesTable, categoriesToPostsTable } from "$lib/server/schema";
import { json, error } from "@sveltejs/kit";
import { eq, getTableColumns } from "drizzle-orm";

export const GET = async ({url}) => {
     const post_id = url.searchParams.get("postId")
     if (!post_id) return json({error: true})
        const postsWithCategories = await dbClient
            .select({
                name: categoriesTable.name 
            })
            .from(postsTable).where(eq(postsTable.id,post_id))
            .leftJoin(categoriesToPostsTable, eq(postsTable.id, categoriesToPostsTable.postId))
            .leftJoin(categoriesTable, eq(categoriesToPostsTable.categoryId, categoriesTable.id))
       
            return json({success:true, data: postsWithCategories});
    
};
