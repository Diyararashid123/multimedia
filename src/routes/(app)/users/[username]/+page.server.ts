import { dbClient } from "$lib/server/db.js";
import { auth } from "$lib/server/lucia";
import {
  postsTable,
  userFollowsTable,
  usersTable,
} from "$lib/server/schema.js";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "@sveltejs/kit";
import { and, eq, ilike } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { SUPABASE_URL, KEY } from "$env/static/private";
import { getPostByUser } from "$lib/helpers/data/posts.js";
import type { PostWithProfile } from "$lib/helpers/types";
import { insertNotification } from "$lib/helpers/data/notifications.js";


export const load = async (request) => {
  const username = request.params.username;
  const session = request.locals.session;
  if (!session) {
    throw redirect(307, "/login");
  }

  const profileResult = await dbClient
    .select()
    .from(usersTable)
    .where(ilike(usersTable.username, username))

  if (profileResult.length === 0) {
    return { status: 404 };
  }

  const profileUser = profileResult[0];
  
  let allowViewing = false;
  const isProfileOwner = session.userId === profileUser.id;

  if (profileUser.isPrivate) {
    if (isProfileOwner) {
      allowViewing = true; 
    } else {
      const followResult = await dbClient
        .select()
        .from(userFollowsTable)
        .where(and(eq(userFollowsTable.follower, session.userId), eq(userFollowsTable.following, profileUser.id)))
        const following = followResult.length > 0 && followResult[0].status === 'approved';
        const pendingApproval = followResult.length > 0 && followResult[0].status === 'pending';

        allowViewing = isProfileOwner || (following && !pendingApproval);
    }
  } else {
    // Public profiles are viewable by anyone
    allowViewing = true;
  }


  let userPosts: PostWithProfile[] = [];
  if (allowViewing) {
    
    userPosts = await getPostByUser(profileUser.id);
  }

  return {
    userPosts,
    allowViewing, 
    isProfileOwner,
    profileUser 
  };
};

export const actions = {
  follow: async (request) => {
    try {
      const session = request.locals.session;
      if (!session) throw new Error('Session not found');

      const username = request.params.username;
      const existingFollow = await dbClient
        .select()
        .from(userFollowsTable)
        .where(and(
          eq(userFollowsTable.follower, session.userId),
          eq(userFollowsTable.following, username)
        ));

      if (existingFollow.length > 0) {
        return { status: 409, message: 'Follow request already sent or approved' };
      }

      const followedUser = await dbClient
        .select()
        .from(usersTable)
        .where(ilike(usersTable.username, username));
      
      if (followedUser.length === 0) {
        return { status: 404, message: 'User not found' };
      }

      const rowId = uuidv4();
      await dbClient.insert(userFollowsTable).values({
        follower: session.userId,
        following: followedUser[0].id,
        status: 'pending',
        id: rowId,
      });

      await insertNotification(session.userId, followedUser[0].id, rowId, "follow");
      return { status: 200, message: 'Follow request sent' };
    } catch (error) {
      console.error('Error handling follow action:', error);
      return { status: 500, message: 'Internal server error' };
    }
  }
,

  updateProfileImage: async (request) => {
    const session = request.locals.session
    if(!session) throw redirect(301, "/")

    const imageUUID = uuidv4();
    const fileName = `image_${imageUUID}.JPG`;

    const _data = await request.request.formData();
    const img = _data.get("image");
    if (!img) return;

    const supabase = createClient(SUPABASE_URL, KEY);

    const { data, error } = await supabase.storage
      .from("test2")
      .upload(fileName, img, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Upload error", error);
      return;
    }

    if (data) {
      const imageUrl = `https://ikcxvcutdjftdsvbpwsa.supabase.co/storage/v1/object/public/test2/${fileName}`;

      await dbClient
        .update(usersTable)
        .set({ profilePictureUrl: imageUrl })
        .where(eq(usersTable.id, session.userId));

      console.log("Profile image updated successfully", imageUrl);
    } else {
      console.log("Failed to upload image");
    }
  },

  deleteProfileImage: async (request) => {
    const session = request.locals.session
    if(!session) throw redirect(301, "/")

    const defaultImageUrl =
      "https://ikcxvcutdjftdsvbpwsa.supabase.co/storage/v1/object/sign/profile-images/default-img.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9maWxlLWltYWdlcy9kZWZhdWx0LWltZy5wbmciLCJpYXQiOjE3MDM0ODg4NjYsImV4cCI6MjAxODg0ODg2Nn0.EeYXUptq697XMxEb5XpbVTtwzm2qwrI2w8cxrD4OySk&t=2023-12-25T07%3A21%3A06.400Z";

    await dbClient
      .update(usersTable)
      .set({ profilePictureUrl: defaultImageUrl })
      .where(eq(usersTable.id, session.userId));

    console.log("Profile image set to default successfully", defaultImageUrl);
  },

  unfollow: async (request) => {
    const session = request.locals.session
    if(!session) throw redirect(301, "/")

    const username = request.params.username;

    const user = await dbClient.select().from(usersTable).where(ilike(usersTable.username, username))

    const row = await dbClient
      .delete(userFollowsTable)
      .where(
        and(
          ilike(userFollowsTable.follower, session.userId),
          ilike(userFollowsTable.following, user[0].id)
        )
      );

  },
};
