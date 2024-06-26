<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from '$app/stores';
  import ProfileSections from "$lib/components/profile/ProfileSections.svelte";
  import Linebreak from "$lib/components/Linebreak.svelte";
  import { onMount } from "svelte";
  import FollowsModal from "$lib/components/profile/FollowsModal.svelte";


  export let data;
  let showProfileOptions = false;
  let name: string = "";
  let showFollowers = false;
  let showFollowing = false;

  function toggleProfileOptions() {
    showProfileOptions = !showProfileOptions;
  }
  let isProcessing = false;



async function handleFollow() {
  isProcessing = true;
  const formData = new FormData()
  formData.append('userId', data.user.id); 
  const response = await fetch(`/users/${data.user.username}/?/follow`, {
    method: 'POST',
    body: formData 
  });
    if (response.ok) {
    
      const updatedData = await response.json(); 

      data = { ...data, following: updatedData.following, pendingApproval: updatedData.pendingApproval };
      window.location.reload();
    } else {
      console.error("Failed to initiate follow");
    }
    isProcessing = false;
  }

  async function handleUnfollow() {
    isProcessing = true;
   
  const formData = new FormData()
  formData.append('userId', data.user.id); 
  const response = await fetch(`/users/${data.user.username}/?/unfollow`, {
    method: 'POST',
    body: formData 
  });
    if (response.ok) {
      const updatedData = await response.json();
      window.location.reload();
      data = { ...data, following: updatedData.following, pendingApproval: false }; 
     
    } else {
      console.error("Failed to unfollow");
    }
    isProcessing = false;
  }




  const toggleFollowers = () => {
    showFollowers = !showFollowers;
  }

  const toggleFollowing = () => {
    showFollowing = !showFollowing;
  }






  onMount(()=>{
    name = (data.user.firstName || "") + (data.user.lastName ? " " + data.user.lastName : "");
  })
</script>

{#if data.user}
  <div class="profile-container">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="pfp-container"
      on:click={toggleProfileOptions}
      tabindex="0"
      role="button"
      aria-label="Toggle profile options"
    >
      <img
        src={data.user.profilePictureUrl}
        alt="{data.user.username}'s profile"
        class="profile-pic"
      />
    </div>

    {#if showProfileOptions}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="profile-options-modal" on:click={toggleProfileOptions}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="modal-content" on:click|stopPropagation>
         
          <form
            method="POST"
            action="?/updateProfileImage"
            enctype="multipart/form-data"
          >
            <input
              id="file"
              class="file-input"
              name="image"
              type="file"
              accept="image/png,image/jpeg"
            />
            <label for="file" class="file-label">Upload</label>

            <Linebreak />
            <button type="submit" class="submit-button">Submit</button>
          </form>
          <Linebreak />
          <form
            method="POST"
            action="?/deleteProfileImage"
            enctype="multipart/form-data"
          >
            <button type="submit" class="submit-button1"
              >Delete Profile Image</button
            >
          </form>
        </div>
      </div>
    {/if}

    <div class="user-info">
      {#if name.length > 0}
        <div>
          <h2>
            {name}
          </h2>
          <p class="last-name">{"@" + data.user.username}</p>
        </div>
      {:else}
        <h2>{data.user.username}</h2>
      {/if}
    </div>
    <div class="stats">
      <span class="post-counter">{data.postsCount} posts</span>
      <button on:click={()=>showFollowers = !showFollowers} class="follow-count">{data.followerCount} followers</button>
      <button on:click={()=>showFollowing = !showFollowing} class="follow-count">{data.followingCount} following</button>
      {#if !data.personalProfile}
      {#if data.pendingApproval}
        <button disabled class="followBtn">Pending Approval</button>
      {:else if data.following}
        <button on:click={handleUnfollow} disabled={isProcessing} class="followBtn">Unfollow</button>
      {:else}
        <button on:click={handleFollow} disabled={isProcessing} class="followBtn">Follow</button>
      {/if}
    {/if}
    </div>
    {#if data.user.bio}
      <p class="description">{data.user.bio}</p>
    {/if}
  </div>

  <ProfileSections username={data.user.username} />

  {#if showFollowers}
    <FollowsModal userId={data.user.id} isPrivate={data.allowViewing} type="followers" toggleFunc={toggleFollowers}/>
  {/if}

  {#if showFollowing}
    <FollowsModal userId={data.user.id} isPrivate={data.allowViewing} type="following" toggleFunc={toggleFollowing} />
  {/if}

  <slot />
{/if}

<style>
  .profile-container {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 2fr auto 2fr auto;
    align-items: center;
    grid-template-areas:
      "picture"
      "info"
      "stats"
      "description";
    gap: 1rem;
    width: 100%;
    text-align: center;
    box-shadow:
      -2px -2px 6px -4px rgba(226, 224, 224, 0.5),
      2px 2px 6px 4px rgba(0, 0, 0, 0.5);

    padding: 1rem;

  }
  .profile-options-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    z-index: 10;
  }

  .modal-content {
    background: #131313;
    padding: 20px;
    border-radius: 0.6em;
    width: 20%;
    box-sizing: border-box;
    margin: auto;
  }
  .pfp-container {
    grid-area: picture;
    place-content: center;
    margin: auto;
  }

  .pfp-container > img {
    width: 10rem;
    height: 10rem;
    object-fit: cover;
    border-radius: 50%;
  }

  .user-info {
    grid-area: info;
    text-align: center;
  }

  .user-info h2 {
    color: white;
    font-size: 2rem;
    margin: 0;
  }

  .last-name {
    color: var(--text-secondary);
  }

  .stats {
    grid-area: stats;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  }

  .stats > span {
    color: white;
  }

  .description {
    grid-area: description;
    color: #c3c0c0;
  }

  .followBtn {
    all: unset;
    box-shadow:
      -2px -2px 6px -4px rgba(226, 224, 224, 0.5),
      2px 2px 6px 4px rgba(0, 0, 0, 0.5);

    padding: 0.5rem;
    border-radius: 25%;
  }
  .submit-button1 {
    color: red;
  }
  .submit-button {
    color: white;
  }

  .submit-button1,
  .submit-button {
    padding: 0.2rem 0.1rem;
    border-radius: 5px;
    cursor: pointer;
    justify-content: center;
    border: none;
    font-size: 1rem;
    padding: 0.5rem;
  }
  /* .posts{
    display: grid;
    grid-template-columns: repeat(auto-fill, 90px);
    gap: 1rem;
    width: 50%;
  } */

  .file-input {
    opacity: 0;
    width: 0.1px;
    height: 0.1px;
    position: absolute;
  }

  .file-label {
    display: flex;
    padding: 0.5rem;
    border-radius: 5px;
    cursor: pointer;
    justify-content: center;
    border: none;
    font-size: 1rem;
  }

  .follow-count{
    all: unset;
    cursor: pointer;
    color: white;
  }
</style>
