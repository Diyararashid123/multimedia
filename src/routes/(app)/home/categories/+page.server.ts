// src/routes/categories/[name]/+page.server.ts
import { error } from '@sveltejs/kit';
import { getPostsByCategoryIds } from "$lib/helpers/data/posts.js";



export async function load({ url }) {
  const categoryQuery = url.searchParams.get('categories');
  const categories = categoryQuery ? categoryQuery.split(',') : [];
  const categoriesPost = await getPostsByCategoryIds(categories);
  if (!categoriesPost) {
    throw error(404, "Posts not found");
  }

  return {
      categoriesPost
  }
}