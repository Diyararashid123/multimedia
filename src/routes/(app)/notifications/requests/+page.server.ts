// Import necessary libraries and modules
import { dbClient } from "$lib/server/db.js";
import { userFollowsTable, usersTable } from "$lib/server/schema.js";
import { redirect } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

export const load = async ({ locals }) => {
  const session = locals.session;

  if (!session) throw redirect(301, "/login");
  
  const notifications = fetchNotifications(session.userId);

  return {
        streamed:{
            notifications
        }
  };
};

const fetchNotifications = async (userId:string) => {
    const data = await dbClient
    .select({
      follower: userFollowsTable.follower,
      following: userFollowsTable.following,
      status: userFollowsTable.status,
      username: usersTable.username,
      profileImage:usersTable.profilePictureUrl,
    })
    .from(userFollowsTable)
    .leftJoin(usersTable, and(eq(userFollowsTable.follower, usersTable.id)))
    .where(
      and(
        eq(userFollowsTable.following, userId),
        eq(userFollowsTable.status, "pending")
      )
    )
    
    return data;
};
export const actions = {
  updateFollowStatus: async ({ request }) => {
    const formData = await request.formData();
    const followerId = formData.get("followerId");
    const followingId = formData.get("followingId");
    const newStatus = formData.get("status");

    if ( typeof followerId !== "string" || typeof followingId !== "string" || (newStatus !== "approved" && newStatus !== "denied")
    ) {
      return {
        status: 400,
        errors: { message: "Invalid request parameters." },
      };
    }

    if (newStatus === "approved") {
      await dbClient
        .update(userFollowsTable)
        .set({ status: "approved" })
        .where(
          and(
            eq(userFollowsTable.follower, followerId),
            eq(userFollowsTable.following, followingId)
          )
        );
    } else if (newStatus === "denied") {
      await dbClient
        .delete(userFollowsTable)
        .where(
          and(
            eq(userFollowsTable.follower, followerId),
            eq(userFollowsTable.following, followingId)
          )
        );
    }

    throw redirect(303, "/notifications/follows");
  },
};
