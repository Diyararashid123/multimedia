<script lang="ts">
    import ReplyForm from "./ReplyForm.svelte";
    import type { CommentWithProfile } from "$lib/helpers/types";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    

    export let comment: CommentWithProfile

    let activeReply:boolean = false;
    export let postId: string;
    let days:string;
    let replyErrorMessage:string = "";


    $:{
        console.log(replyErrorMessage)
    }

    const navigateToComment = () =>{
        goto(`/post/${postId}/${comment.comment.id}`)
    }
      let liked = false;
  
  async function toggleLike() {
    
    const response = await fetch(`/api/likes/CommentLikes`, {
      method: liked ? "DELETE": "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId: comment.comment.id, postId }),
    });

    const data = await response.json();
    if (data.success) {
      liked = !liked;
    } else {
      console.error("Failed to toggle like:", data.message);
    }
  }

  onMount(async()=>{
    const data = await fetch(`/api/likes/CommentLikes?id=${comment.comment.id}`)
    const res = await data.json()
    liked = res.liked;

    let originalTime;
    // IDK WHY ITS INCONSISTENT 
    if (typeof comment.comment.date === 'string') {
      // If the timestamp is a string (e.g., ISO format)
      originalTime = new Date(comment.comment.date);
    } else {
      // If the timestamp is a Date object
      originalTime = comment.comment.date;
    }
    const currTime = new Date();
    const originalTimeValue = comment.comment.date!;
    let time: number | undefined;
    let difference: number;

    time = new Date(originalTimeValue).getTime();
    difference = currTime.getTime() - time;

    if (difference < 60000) { // Less than 1 minute
      const minutes = Math.floor(difference / 1000 / 60);
      days = `${minutes}m`;
    } else if (difference < 3600000) { // Less than 1 hour
      const minutes = Math.floor(difference / 1000 / 60);
      days = `${minutes}m`;
    } else if (difference < 86400000) { // Less than 1 day
      const hours = Math.floor(difference / 1000 / 60 / 60);
      days = `${hours} h`;
    } else { // 1 day or more
      const _days = Math.floor(difference / 1000 / 60 / 60 / 24);
      days = `${_days} d`;
    }
    })

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="comment-container" on:click|self={navigateToComment}>
    <a href={`/users/${comment.author.username}`} class="user-link">
    <div class="comment-author" on:click|self={navigateToComment}>
            <img class="profile-image" src={comment.author.profilePictureUrl} alt="Profile icon"/>
            <p class="author">{comment.author.username}</p>
            <p class="timestamp">{`.${days}`}</p>
    </div>
</a>
    <div class="comment-content">{comment.comment.comment}</div>
    <div class="icons-container">
        <div class="like-container">
            <button class="like-btn" on:click={toggleLike}>
                <img class:like={liked} src={!liked ? "/images/icons/like.png" : "/images/icons/likeFilled.png"} alt="Like Icon"/>
            </button>
            <span class="like-count">{comment.comment.likeCount}</span>
        </div>
        <div class="reply-container">
            <button on:click={()=>{activeReply = !activeReply}}><img src ="/images/icons/reply.png" alt="Reply Icon"></button>
            <p>{comment.comment.replyCount}</p>
        </div>
    </div>

    {#if activeReply}
        <ReplyForm commentId={comment.comment.id} {postId} {replyErrorMessage}/>
    {/if}

    {#if replyErrorMessage.length > 0}
        <p class="error-message">{replyErrorMessage}</p>
    {/if}
</div>

<style>
    .comment-container{
        display: grid;
        gap: 0.75rem;
    }

    .error-message{
        color: red;
    }

    a{
        text-decoration: none;
        color: inherit;
    }
    .comment-author{
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    
    .author{
        font-size: 1.2rem;
    }

    .timestamp{
        font-size: 0.75rem;
        color: var(--text-secondary);
    }

    .comment-content{
        line-height: 22px;
        width: fit-content
    }

    .icons-container{
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    button {
        padding: .45rem;
        width: 2rem;
        height: 2rem;
        border: none;
    }

    .profile-image{
        border-radius: 50%;
        object-fit: cover;
        width: 3rem;
        height: 3rem;
    }

    .like-container, .reply-container{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
</style>