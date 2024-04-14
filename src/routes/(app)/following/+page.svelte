<script lang="ts">
  import Categories from "$lib/components/Categories.svelte";
    export let data;
    import Post from "$lib/components/post/Post.svelte";
    import PostForm from "$lib/components/post/PostForm.svelte";

</script>
<div>
    <Categories groups={data.groups}/>
    <PostForm />
    {#if data}
        <div class="posts-container">
            {#each data.posts as post, i}
                <Post post={post} firstPost={i === 0} lastPost={i===data.posts.length - 1}/>
          
            {/each}
        </div>
    {/if}

</div>

<style>

    div{
        justify-self: center;
        display: grid;
        gap: 1.25rem;
        width: 100%;
    }

    .posts-container{
        display: grid;
        gap: 1rem;
    }
</style>