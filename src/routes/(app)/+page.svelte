<script lang="ts">
  import Categories from "$lib/components/Categories.svelte";
    export let data;

    import Post from "$lib/components/post/Post.svelte";
    import PostForm from "$lib/components/post/PostForm.svelte";
    import { mainContainerStore } from "$lib/helpers/stores.js";

  let categories: HTMLDivElement;



</script>
<div>
    <!-- need a target to scroll to and i cant target an-->
    <div bind:this={categories} class="placeholder"></div>
    <Categories groups={data.groups} />
    <PostForm />

    {#if data}
        <div class="posts-container">
            {#each data.rows as row, i}
                <Post post={row} firstPost={i === 0} lastPost={i===data.rows.length - 1}/>
            {/each}
        </div>
    {/if}
    

</div>

<style>

    .placeholder{
        height: 1px;
    }

    div{
        justify-self: center;
        display: grid;
        gap: 1.25rem;
        width: 100%;
        position: relative;
    }

    .posts-container{
        display: grid;
        gap: 1rem;
    }
</style>