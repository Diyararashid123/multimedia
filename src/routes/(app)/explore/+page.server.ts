import {
  rankedPosts,
  getRecommendedPosts,
  recommendUsers,
} from "$lib/helpers/data/posts.js";
import { dbClient } from "$lib/server/db.js";
import {
  userCategoryInteractionTable,
} from "$lib/server/schema.js";
import { error, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load = async ({ locals }) => {
  if (!locals.session) throw redirect(301, "/login");

  const userId = locals.session.userId;

  const interactionResult = await dbClient
    .select()
    .from(userCategoryInteractionTable)
    .where(eq(userCategoryInteractionTable.userId, userId));

  let allPosts;

  if (interactionResult.length === 0) {
    allPosts = rankedPosts(0);
  } else {
    allPosts =  getRecommendedPosts(userId);
  }

  const recommendedUsers =  await recommendUsers(userId);

  return {
    streamed:{
      allPosts,
    },
    recommendedUsers,
    
  };
};
