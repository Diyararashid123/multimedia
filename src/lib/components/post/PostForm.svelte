<script lang="ts">
  import { enhance } from "$app/forms";
  
  let videoInput: HTMLInputElement;
  let imageInput: HTMLInputElement;
  let videoFileName: string = '';
  let imageFileName: string = '';
  let submitBtn:HTMLButtonElement
  import {page} from '$app/stores'

  page.subscribe((value)=>{
    if(value.form){
      if(value.form.success){
          submitBtn.disabled = false
          videoFileName = '';
          imageFileName = '';
          videoInput.value = '';
          imageInput.value = '';
      }
      else{
        submitBtn.disabled = false
      }
    }
  })
  function updateFileName() {
    videoFileName = videoInput?.files?.[0]?.name ?? '';
    imageFileName = imageInput?.files?.[0]?.name ?? '';
  }
  function handleFormSubmit() {
    if(!submitBtn.disabled)
     submitBtn.disabled = true;
    }
</script>

<!--Weird bugs with post component not getting the right data when the load function is revalidated so we will force page refresh in the page store -->
<form method="POST" use:enhance action="?/post" enctype="multipart/form-data" on:submit={handleFormSubmit}>
  <i class="fa-solid fa-circle-user fa-2xl"></i>
  <div class="container">
    <textarea name="post-content" placeholder="How was your day?"></textarea>
    <input
      bind:this={videoInput}
      class="file-input"
      name="video"
      type="file"
      accept="video/mp4,video/x-m4v,video/*"
      hidden
      on:change={updateFileName}
    />
    <input
      bind:this={imageInput}
      class="file-input"
      name="pictureUrl"
      type="file"
      accept="image/png,image/jpeg"
      hidden
      on:change={updateFileName}
    />
    <div class="icons-container">
      <div class="post-icons">
        <button on:click|preventDefault={() => videoInput.click()}>
          <img src="/images/icons/upload-video.png" alt="Upload Video Icon" />
          {#if videoFileName}
            <p>{videoFileName}</p>
          {/if}
        </button>
        <button on:click|preventDefault={() => imageInput.click()}>
          <!-- svelte-ignore a11y-img-redundant-alt -->
          <img src="/images/icons/upload-image.png" alt="Upload Image Icon" />
          {#if imageFileName}
            <p>{imageFileName}</p>
          {/if}
        </button>
      </div>
      <button bind:this={submitBtn} class="submit-btn" type="submit">Post</button>
    </div>
  </div>
</form>

{#if $page.form && $page.form.error && $page.form.message}
  <p class="error-message">{$page.form.message}</p>
{/if}


<style>
  form {
    display: flex;
    gap: 1rem;
    justify-self: center;
    margin-bottom: 1rem;
    align-items: baseline;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 1rem;
  }

  button {
    border: 0;
    padding: 0;
  }
  button > img {
    width: 100%;
  }

  .submit-btn {
    /**dont ask*/
    font-size: 0.875rem;
    border: none;
    background-color: var(--action);
    padding: 1rem 2rem;
    color: inherit;
  }

  .submit-btn:disabled{
    background-color: gray;
  }

  textarea {
    flex-grow: 1;
    padding: 1rem;
    border-radius: 1rem;
    flex-basis: 90%;
    height: auto;
    box-shadow:
      -2px -2px 6px -4px rgba(226, 224, 224, 0.5) inset,
      2px 2px 6px 4px rgba(0, 0, 0, 0.5) inset;
    background-color: transparent;
    border: none;
    color: inherit;
    font: inherit;
    resize: none;
    transition: border-radius 0.5s;
  }

  textarea:focus {
    border-radius: 0;
    outline: none;
  }

  textarea:focus {
    border: none;
  }

  .icons-container {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-basis: 100%;
    align-items: center;
  }

  .post-icons {
    display: flex;
    align-items: baseline;
    gap: 1rem;
  }

  button > img {
    width: 1.75rem;
  }

  i {
    color: var(--secondary);
  }

  .error-message {
    color: red;
    font-size: 1.2rem;
  }

  @media (max-width: 968px) {
    form {
      width: 80%;
    }
  }
</style>