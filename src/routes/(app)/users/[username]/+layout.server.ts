import { dbClient } from "$lib/server/db.js";
import {
  commentsTable,
  postsTable,
  userFollowsTable,
  usersTable,
} from "$lib/server/schema.js";
import { redirect } from "@sveltejs/kit";
import { count, eq, ilike, and, ne } from "drizzle-orm";

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
    const isPublic = !user.isPrivate;
    let allowViewing = isProfileOwner || isPublic;
    
    
  
    let postsCount = 0, followerCount = 0, followingCount = 0;
    if (allowViewing) {
      postsCount = await dbClient
          .select({value: count()})
          .from(postsTable)
          .where(eq(postsTable.author, user.id))
          .then(result => result[0]?.value ?? 0);

      followerCount = await dbClient
          .select({value: count()})
          .from(userFollowsTable)
          .where(and(eq(userFollowsTable.following, user.id), ne(userFollowsTable.status, 'pending')))
          .then(result => result[0]?.value ?? 0);

      followingCount = await dbClient
          .select({value: count()})
          .from(userFollowsTable)
          .where(and(eq(userFollowsTable.follower, user.id), ne(userFollowsTable.status, 'pending')))
          .then(result => result[0]?.value ?? 0);
    }

  
const following = followResults.length > 0 && followResults[0].status === 'approved';
const pendingApproval = followResults.length > 0 && followResults[0].status === 'pending' && !isPublic;

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