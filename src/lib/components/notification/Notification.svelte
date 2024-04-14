<script lang="ts">
  import type { NotificationType } from "$lib/helpers/types";

  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let link: string = ""
  let text: string = ""
  export let notification: NotificationType;

    onMount(()=>{
      switch (notification.notification.entityType) {
        case 'follow':
          text = `${notification.user?.username} has followed you`;
          link = `/users/${notification.user?.username}`;
          break;
        case 'post':
          text = `${notification.user?.username} has created a new post`;
          link = `/post/${notification.notification.entityId}`;
          break;
        case 'comment':
          text = `${notification.user?.username} has commented on your post`;
          link = `/post/${notification.notification.parentId}/${notification.notification.entityId}`;
          break;
        case 'post_like':
          text = `${notification.user?.username} has liked your post`;
          link = `/post/${notification.notification.entityId}`;
          break;
        // Add more cases for other entity types
        default:
          text = 'New notification';
          link = '#';
      }
    })

    const navigateToSource = () =>{
      goto(link) 
    }

</script>

<button on:click={navigateToSource}>
  <div class="container">
    <div class="user">
      <img src={notification.user?.profilePictureUrl} alt="User Profile Icon"/>
      <p>{text}</p>
    </div>
    <p class="content">{notification.notification.content || ""}</p>
  </div>
</button>


<style>
  button{
    all:unset;
    cursor: pointer;
  }
  .container{
    border: 1px solid var(--action);
    padding: 1rem;
    border-radius: 16px;
  }

  img{
    width: 3rem;
  }

  .user{
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .content{
    color: var(--text-secondary);
  }
</style>