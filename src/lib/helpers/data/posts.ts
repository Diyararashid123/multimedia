import {
  postsTable,
  usersTable,
  likesPostTable,
  commentsTable,
  userFollowsTable,
  categoriesToPostsTable,
  categoriesTable,
  userCategoryInteractionTable,
} from "../../server/schema";
import { dbClient } from "../../server/db";
import {
  eq,
  desc,
  getTableColumns,
  count,
  like,
  ilike,
  and,
  isNull,
  or,
  inArray,
  sql,
  sum,
  asc,
  
} from "drizzle-orm";
import type { PostWithProfile, UserType } from "../types";

const likeSubquery = dbClient
.select({
  likeCount: count(likesPostTable.id).as("likeCount"),
  post: likesPostTable.post,
})
.from(likesPostTable)
.groupBy(likesPostTable.post)
.as("likeSubquery");
const commentSubquery = dbClient
.select({
  commentCount: count(commentsTable.post).as("commentCount"),
  post: commentsTable.post,
})
.from(commentsTable)
.groupBy(commentsTable.post)
.as("commentSubquery");

export async function getPosts(skip: number) {
  const _rows = (await dbClient
    .select({
      post: {
        ...getTableColumns(postsTable),
        likeCount: likeSubquery.likeCount,
        commentCount: commentSubquery.commentCount,
        viewCount: postsTable.viewCount,
      },
      author: { ...getTableColumns(usersTable) },
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.author, usersTable.id))
    .leftJoin(likeSubquery, eq(postsTable.id, likeSubquery.post))
    .leftJoin(commentSubquery, eq(postsTable.id, commentSubquery.post))
    .limit(5)
    .offset(skip)
    .orderBy(desc(postsTable.timestamp))) as PostWithProfile[];

  const rows = _rows.map((data) => {
    if (data.post.commentCount === null) {
      data.post.commentCount = 0;
    }
    if (data.post.likeCount === null) {
      data.post.likeCount = 0;
    }
    return data;
  });

  return rows;
}
export async function rankedPosts(skip: number) {
  const _rows = (await dbClient
    .select({
      post: {
        ...getTableColumns(postsTable),
        likeCount: likeSubquery.likeCount,
        commentCount: commentSubquery.commentCount,
        viewCount: postsTable.viewCount,
      },
      author: { ...getTableColumns(usersTable) },
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.author, usersTable.id))
    .leftJoin(likeSubquery, eq(postsTable.id, likeSubquery.post))
    .leftJoin(commentSubquery, eq(postsTable.id, commentSubquery.post))
    .limit(5)
    .offset(skip)
    .orderBy(desc(postsTable.viewCount),desc(postsTable.timestamp))) as PostWithProfile[];

  const rows = _rows.map((data) => {
    if (data.post.commentCount === null) {
      data.post.commentCount = 0;
    }
    if (data.post.likeCount === null) {
      data.post.likeCount = 0;
    }
    return data;
  });

  return rows;
}
export async function getPostById(id: string) {

  const _rows = (await dbClient
    .select({
      post: {
        ...getTableColumns(postsTable),
        likeCount: likeSubquery.likeCount,
        commentCount: commentSubquery.commentCount,
      },
      author: { ...getTableColumns(usersTable) },
    })
    .from(postsTable)
    .where(eq(postsTable.id, id))
    .leftJoin(usersTable, eq(postsTable.author, usersTable.id))
    .leftJoin(likeSubquery, eq(postsTable.id, likeSubquery.post))
    .leftJoin(commentSubquery, eq(postsTable.id, commentSubquery.post))
    .orderBy(desc(postsTable.timestamp))) as PostWithProfile[];

  const rows = _rows.map((data) => {
    if (data.post.commentCount === null) {
      data.post.commentCount = 0;
    } 
    if (data.post.likeCount === null) {
      data.post.likeCount = 0;
    }
    return data;
  });

  return rows[0];
}

export async function getPostByUser(userId: string) {

  const _rows = (await dbClient
    .select({
      post: {
        ...getTableColumns(postsTable),
        likeCount: likeSubquery.likeCount,
        commentCount: commentSubquery.commentCount,

      },
      author: { ...getTableColumns(usersTable) },
    })
    .from(postsTable)
    .where(eq(usersTable.id, userId))
    .leftJoin(usersTable, eq(postsTable.author, usersTable.id))
    .leftJoin(likeSubquery, eq(postsTable.id, likeSubquery.post))
    .leftJoin(commentSubquery, eq(postsTable.id, commentSubquery.post))
    .orderBy(desc(postsTable.timestamp))) as PostWithProfile[];

  const rows = _rows.map((data) => {
    if (data.post.commentCount === null) {
      data.post.commentCount = 0;
    } 
    if (data.post.likeCount === null) {
      data.post.likeCount = 0;
    }
    return data;
  });

  return rows;
}

export async function getLikedPosts(userId: string) {

  const _rows = (await dbClient
    .select({
      post: {
        ...getTableColumns(postsTable),
        likeCount: likeSubquery.likeCount,
        commentCount: commentSubquery.commentCount,
      },
      author: { ...getTableColumns(usersTable) },
    })
    .from(likesPostTable)
    .where(eq(likesPostTable.author, userId))
    .leftJoin(postsTable, eq(postsTable.id, likesPostTable.post))
    .leftJoin(usersTable, eq(usersTable.id, postsTable.author))
    .leftJoin(likeSubquery, eq(postsTable.id, likeSubquery.post))
    .leftJoin(commentSubquery, eq(postsTable.id, commentSubquery.post))
    .orderBy(desc(postsTable.timestamp))) as PostWithProfile[];

  const rows = _rows.map((data) => {
    if (data.post.commentCount === null) {
      data.post.commentCount = 0;
    } 
    if (data.post.likeCount === null) {
      data.post.likeCount = 0;
    }
    return data;
  });

  return rows;
}

export async function getFollowingPosts(userId: string) {

  const _rows = (await dbClient
    .select({
      post: {
        ...getTableColumns(postsTable),
        likeCount: likeSubquery.likeCount,
        commentCount: commentSubquery.commentCount,
      },
      author: { ...getTableColumns(usersTable) },
    })
    .from(postsTable)
    .leftJoin(userFollowsTable, eq(userFollowsTable.follower, userId))
    .where(eq(postsTable.author, userFollowsTable.following))
    .leftJoin(usersTable, eq(postsTable.author, usersTable.id))
    .leftJoin(likeSubquery, eq(postsTable.id, likeSubquery.post))
    .leftJoin(commentSubquery, eq(postsTable.id, commentSubquery.post))
    .orderBy(desc(postsTable.timestamp))) as PostWithProfile[];

  const rows = _rows.map((data) => {
    if (data.post.commentCount === null) {
      data.post.commentCount = 0;
    }
    if (data.post.likeCount === null) {
      data.post.likeCount = 0;
    }
    return data;
  });

  return rows;
}

export async function queryPost(query: string) {
  // using subqueries because jamming both aggregating count functions into one query is causing a cartesian product issue

  const _rows = (await dbClient
    .select({
      post: {
        ...getTableColumns(postsTable),
        likeCount: likeSubquery.likeCount,
        commentCount: commentSubquery.commentCount,
      },
      author: { ...getTableColumns(usersTable) },
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.author, usersTable.id))
    .leftJoin(likeSubquery, eq(postsTable.id, likeSubquery.post))
    .leftJoin(commentSubquery, eq(postsTable.id, commentSubquery.post))
    .where(ilike(postsTable.content, `%${query}%`))
    .orderBy(asc(postsTable.viewCount),desc(postsTable.timestamp))) as PostWithProfile[];

  const rows = _rows.map((data) => {
    if (data.post.commentCount === null) {
      data.post.commentCount = 0;
    }
    if (data.post.likeCount === null) {
      data.post.likeCount = 0;
    }
    return data;
  });

  return rows;
}

export async function incrementPostViewCount(postId: string) {
  await dbClient.update(postsTable)
      .set({
          viewCount: sql`${postsTable.viewCount} + 1`
      })
      .where(eq(postsTable.id, postId));

    }
export async function getTextOnlyPosts() {

  const _rows = await dbClient
    .select({
      post: {
        ...getTableColumns(postsTable),
        likeCount: likeSubquery.likeCount,
        commentCount: commentSubquery.commentCount,
      },
      author: { ...getTableColumns(usersTable) },
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.author, usersTable.id))
    .leftJoin(likeSubquery, eq(postsTable.id, likeSubquery.post))
    .leftJoin(commentSubquery, eq(postsTable.id, commentSubquery.post))

    .where(
      and(
        or(isNull(postsTable.videoUrl), eq(postsTable.videoUrl, "")),
        or(isNull(postsTable.pictureUrl), eq(postsTable.pictureUrl, ""))
      )
    )
    .orderBy(desc(postsTable.timestamp)) as PostWithProfile[];

  const rows = _rows.map((data) => {
    if (data.post.commentCount === null) {
      data.post.commentCount = 0;
    }
    if (data.post.likeCount === null) {
      data.post.likeCount = 0;
    }
    return data;
  });

  return rows;
}

export async function getMediaPosts() {

  const _rows = await dbClient
    .select({
      post: {
        ...getTableColumns(postsTable),
        likeCount: likeSubquery.likeCount,
        commentCount: commentSubquery.commentCount,
      },
      author: { ...getTableColumns(usersTable) },
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.author, usersTable.id))
    .leftJoin(likeSubquery, eq(postsTable.id, likeSubquery.post))
    .leftJoin(commentSubquery, eq(postsTable.id, commentSubquery.post))
    .where(
      or(
        ilike(postsTable.videoUrl, "%://%"),
        ilike(postsTable.pictureUrl, "%://%")
      )
    )
    .orderBy(desc(postsTable.timestamp)) as PostWithProfile[]; 

  const rows = _rows.map((data) => {
    if (data.post.commentCount === null) {
      data.post.commentCount = 0;
    }
    if (data.post.likeCount === null) {
      data.post.likeCount = 0;
    }
    return data;
  });

  return rows;
}


export async function getPostsByCategoryIds(categoryName: string[]) {
  
  const Categories = await dbClient
    .select({
      id: categoriesTable.id,
    })
    .from(categoriesTable)
    .where(inArray(categoriesTable.name, categoryName))


  
  if (!Categories.length) return []; 

  const mltiCategoryId = Categories.map(category => category.id);

  const _rows = (await dbClient
    .select({
      post: {
        ...getTableColumns(postsTable),
        likeCount: likeSubquery.likeCount,
        commentCount: commentSubquery.commentCount,
      },
      author: { ...getTableColumns(usersTable) },
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.author, usersTable.id))
    .leftJoin(likeSubquery, eq(postsTable.id, likeSubquery.post))
    .leftJoin(commentSubquery, eq(postsTable.id, commentSubquery.post))
    .leftJoin(categoriesToPostsTable, eq(postsTable.id, categoriesToPostsTable.postId))
    .where(inArray(categoriesToPostsTable.categoryId, mltiCategoryId))
    .orderBy(desc(postsTable.timestamp))) as PostWithProfile[];



    const rows = _rows.map((data) => {
      if (data.post.commentCount === null) {
        data.post.commentCount = 0;
      }
      if (data.post.likeCount === null) {
        data.post.likeCount = 0;
      }
      return data;
    });
  
    return rows;
  }

export async function incrementInteraction(userId: string, categoryId: string, postId: string) {
  const existingInteraction = await dbClient.select()
    .from(userCategoryInteractionTable)
    .where(and(
      eq(userCategoryInteractionTable.userId, userId),
      eq(userCategoryInteractionTable.categoryId, categoryId),
      eq(userCategoryInteractionTable.postCategoryId,postId)
    ))
    

  if (existingInteraction.length > 0) {
    await dbClient.update(userCategoryInteractionTable)
    .set({
      interactionCount: sql`${userCategoryInteractionTable.interactionCount} + 1`
    })
    .where(and(
      eq(userCategoryInteractionTable.userId, userId),
      eq(userCategoryInteractionTable.categoryId, categoryId)
    ))
  } else {
    await dbClient.insert(userCategoryInteractionTable).values({
      userId: userId,
      categoryId: categoryId,
      interactionCount: 1,
      postCategoryId : postId
    })
}

}
export async function fetchInteractionPercentages(userId: string) {
  // Fetch all categories for the given user  and calculate how many times they've been interact
  const interactions = await dbClient
    .select({
      categoryId: userCategoryInteractionTable.categoryId,
      count: (userCategoryInteractionTable.interactionCount)
    })
    .from(userCategoryInteractionTable)
    .where(eq(userCategoryInteractionTable.userId, userId))


  // Get total number of interactions for 
  const totalInteractions = interactions.reduce((acc, curr) => {
    const count = Number(curr.count || 0); 
    return acc + count;
  }, 0);







const test = interactions.map(category => ({
    categoryId: category.categoryId,
    percentage: (Number(category.count) / totalInteractions) * 100 
  }));


return test;

}


export async function getRecommendedPosts(userId: string): Promise<PostWithProfile[]> {
  const interactionPercentages = await fetchInteractionPercentages(userId);

  let postsMap = new Map();
  for (const interaction of interactionPercentages) {
    const postLimit = 10;
    const postCount = Math.round((interaction.percentage / 100) * postLimit);
    const _rows = await dbClient.selectDistinct({
        post: {
          ...getTableColumns(postsTable),
          likeCount: likeSubquery.likeCount,
          commentCount: commentSubquery.commentCount,
        },
        author: { ...getTableColumns(usersTable) },
      })
      .from(postsTable)
      .leftJoin(categoriesToPostsTable, eq(postsTable.id, categoriesToPostsTable.postId))
      .leftJoin(usersTable, eq(postsTable.author, usersTable.id))
      .leftJoin(likeSubquery, eq(postsTable.id, likeSubquery.post))
      .leftJoin(commentSubquery, eq(postsTable.id, commentSubquery.post))
      .where(eq(categoriesToPostsTable.categoryId, interaction.categoryId))
      .limit(postCount)
      .orderBy(desc(postsTable.timestamp));

    // Storing posts in a map to ensure uniqueness
    _rows.forEach(post => {
      if (!postsMap.has(post.post.id)) {
        postsMap.set(post.post.id, post);
      }
    });
  
  }

  const uniquePosts = Array.from(postsMap.values());

  const checkPostsUniquenes = uniquePosts.map(post => {
    post.post.commentCount = post.post.commentCount ?? 0;
    post.post.likeCount = post.post.likeCount ?? 0;
    return post;
  });

  return checkPostsUniquenes;
}


async function fetchUserInteractionVector(userId: string): Promise<Record<string, number>> {
  const interactions = await dbClient
      .select({
          categoryId: userCategoryInteractionTable.categoryId,
          count: userCategoryInteractionTable.interactionCount
      })
      .from(userCategoryInteractionTable)
      .where(eq(userCategoryInteractionTable.userId, userId))
   

  const vector: Record<string, number> = {};
  interactions.forEach(interaction => {
      // Use 0 as a default value if interaction.count is null
      vector[interaction.categoryId] = interaction.count ?? 0;
  });
  return vector;
}

// Function to calculate similarity
function calculateSimilarity(vec1: Record<string, number>, vec2: Record<string, number>): number {
  const categories = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  categories.forEach(category => {
      const v1 = vec1[category] || 0;
      const v2 = vec2[category] || 0;
      dotProduct += v1 * v2;
      mag1 += v1 ** 2;
      mag2 += v2 ** 2;
  });

  if (mag1 === 0 || mag2 === 0) return 0; // Avoid division by zero importent!!
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

export async function recommendUsers(currentUserId: string) {
  const currentUserVector = await fetchUserInteractionVector(currentUserId);
  const users: UserType[] = await dbClient.select().from(usersTable)

  const recommendations: Array<{user: UserType, similarity: number}> = [];

  for (let user of users) {
      if (user.id === currentUserId) continue; 
      const userVector = await fetchUserInteractionVector(user.id);
      const similarity = calculateSimilarity(currentUserVector, userVector);
      recommendations.push({ user, similarity });
  }

  // Sort by highest similarity
  recommendations.sort((a, b) => b.similarity - a.similarity);

  return recommendations;
}