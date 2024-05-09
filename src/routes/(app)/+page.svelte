<script lang="ts">
  import Categories from "$lib/components/Categories.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    export let data;

    import Post from "$lib/components/post/Post.svelte";
    import PostForm from "$lib/components/post/PostForm.svelte";
  import { onMount } from "svelte";

  let categories: HTMLDivElement;
  let postsEnd:HTMLDivElement;

  let firstPostId: string;

  let skipCount = 5;
  let loading: boolean = false;
  let observer: IntersectionObserver | null = null;


  // any data fetched inside onmount is being inherited by new posts
  //until that is fixed that just gonna force refresh when the id of the first post changes aka a new post is added
  $:if(data){
    if(data.rows[0].post.id !== firstPostId && firstPostId && firstPostId.length > 0){
      window.location.reload();
    }
  }

  onMount(()=>{

    firstPostId = data.rows[0].post.id;
    observer = new IntersectionObserver(entries =>{
      if(entries[0].isIntersecting){
       fetchPosts()
      }
    })
    observer.observe(postsEnd)
  })

    const fetchPosts = async() => {

        loading = true;
        const req = await fetch(`/api/posts?count=${skipCount}`);
        const res = await req.json()

        if(res.success){
            data.rows = [...data.rows, ...res.data];
            skipCount += 5;
        }
        loading = false
    };

</script>
<div>
    <!-- need a target to scroll to and i cant target an-->
    <div bind:this={categories} class="placeholder"></div>
    <Categories groups={data.groups} />
    <PostForm />

    {#if data}
        <div class="posts-container">
            {#each data.rows as row, i}
                <Post on:lastPostInView={fetchPosts} post={row} firstPost={i === 0} lastPost={i===data.rows.length - 1}/>
            {/each}
             <div class="end" bind:this={postsEnd}></div>
        </div>
        {#if loading}
            <LoadingSpinner/>
        {/if}
    {/if}
    

</div>

<style>
    .end{
        height: 1px;
    }
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