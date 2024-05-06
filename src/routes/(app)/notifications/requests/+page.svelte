<script lang="ts">
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
import Notification from "$lib/components/notification/Notification.svelte"
    export let data;

</script>

{#await data.streamed.notifications}
    <LoadingSpinner/>
{:then notifications}
        {#if notifications.length === 0}
            <p>No notifications</p>
        {/if}
        <ul class="notification-list">
            {#each notifications as notification}
                <li class="notification-card">
                    <div class="user-info">
                    <img class="user-image" src={notification.profileImage} alt="{notification.username}'s profile picture">
                    <p>{notification.username} wants to follow you.</p>
                    </div>
                    <form method="POST" action="?/updateFollowStatus" enctype="multipart/form-data">
                    <input type="hidden" name="followerId" value={notification.follower} />
                    <input type="hidden" name="followingId" value={notification.following} />
                    <div class="buttons">
                        <button type="submit" name="status" value="approved">Accept</button>
                        <button type="submit" name="status" value="denied">Deny</button>
                    </div>
                    </form>
                </li>
            {/each}
        </ul>
{/await}

<style>
  .notification-list {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
    padding: 1rem;
  }

  .notification-card {
    display: flex;
    flex-direction: column;
    background: #131313;
    padding: 15px;
    border-radius: 8px;
    box-shadow:
      5px 5px 10px 0px rgba(0, 0, 0, 0.2),
      -3px -3px 10px 0px rgba(255, 255, 255, 0.05);
    color: white;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    
  }
  .notification-card:hover,
  .notification-card:focus {
    transform: translateY(-5px);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -4px rgba(0, 0, 0, 0.1);
  }
  .user-image {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
  }

  button {
    padding: 6px 12px;
    background-color: #6C5CD6;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
  
</style>
