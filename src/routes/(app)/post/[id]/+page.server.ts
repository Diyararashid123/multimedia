import { dbClient } from '$lib/server/db.js';
import {
  commentsTable, postsTable, usersTable, likesPostTable, categoriesToPostsTable, userCategoryInteractionTable
} from '$lib/server/schema.js';
import { eq, getTableColumns } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { CommentWithProfile, PostWithProfile } from '$lib/helpers/types';
import { getPostById, incrementPostViewCount } from '$lib/helpers/data/posts.js';
import { getComments } from '$lib/helpers/data/comments.js';
import { incrementInteraction } from '$lib/helpers/data/posts.js';

export const load = async ({ params, locals }) => {
    const postId = params.id;
    if (!locals.session || !locals.session.userId) {
        throw error(401, "User not authenticated");
    }
    const userId = locals.session.userId;  

    const post = await getPostById(postId);
    if (!post) {
        throw error(404, "Post not found.");
    }

    await incrementPostViewCount(postId);
    const categories = await dbClient.select()
        .from(categoriesToPostsTable)
        .where(eq(categoriesToPostsTable.postId, postId))
        
        if (categories.length > 0) {
            categories.forEach(async (category) => {
                if (category.categoryId) {  
                    await incrementInteraction(userId, category.categoryId,postId);
                }
            });
        }

    const comments = await getComments(postId);
    return {
        post, comments,
    };
};
