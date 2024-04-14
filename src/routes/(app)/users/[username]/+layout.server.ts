import { dbClient } from "$lib/server/db.js";
import {
  commentsTable,
  postsTable,
  userFollowsTable,
  usersTable,
} from "$lib/server/schema.js";
import { redirect } from "@sveltejs/kit";
import { count, eq, ilike, and } from "drizzle-orm";

export const load = async (request) => {
    const session = request.locals.session;
    if (!session) {
      throw redirect(301, "/login");
    }
  
    const username = request.params.username;
    const userResult = await dbClient.select().from(usersTable).where(ilike(usersTable.username, username));
    if (userResult.length === 0) {
      throw redirect(301, "/not-found");
    }
  
    const user = userResult[0];
    const isProfileOwner = session.userId === user.id;
  

    const followResults = await dbClient
    .select()
    .from(userFollowsTable)
    .where(and(
      eq(userFollowsTable.follower, session.userId),
      eq(userFollowsTable.following, user.id)
    ));
   
  
    const following = followResults.length > 0 && followResults[0].status === 'approved';
    const pendingApproval = followResults.length > 0 && followResults[0].status === 'pending';
    let allowViewing = isProfileOwner || (following && !user.isPrivate) || (following && user.isPrivate);
  
    let postsCount = 0, followerCount = 0, followingCount = 0;
    if (allowViewing) {
      const postsCountResult = await dbClient.select({value: count()}).from(postsTable).where(eq(postsTable.author, user.id));
      postsCount = postsCountResult[0]?.value ?? 0;
      const followerCountResult = await dbClient.select({value: count()}).from(userFollowsTable).where(eq(userFollowsTable.following, user.id));
      followerCount = followerCountResult[0]?.value ?? 0;
      const followingCountResult = await dbClient.select({value: count()}).from(userFollowsTable).where(eq(userFollowsTable.follower, user.id));
      followingCount = followingCountResult[0]?.value ?? 0;
    }
  
    return {
      user,
      postsCount,
      followerCount,
      followingCount,
      personalProfile: isProfileOwner,
      pendingApproval,
      following,
      allowViewing,
    };
  };