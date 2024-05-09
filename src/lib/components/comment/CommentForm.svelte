<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import {page} from '$app/stores'
  export let postId:string;
  let submitBtn:HTMLButtonElement;
  let errorMessage:string = "";
  let commentTextArea:HTMLTextAreaElement;

    function handleFormSubmit() {
    errorMessage = "";
    if(!submitBtn.disabled)
     submitBtn.disabled = true;
    }

</script>


<form method="post" action="/?/comment" use:enhance={()=>{
    return async({result})=>{
        submitBtn.disabled = false;
        if(result.type==="failure"){
            errorMessage = "Failed to send comment";
        }
        else if (result.type === "success"){
            errorMessage = "";
            commentTextArea.value = "";
            commentTextArea.focus();
            invalidate("/post/"+postId)

        }
    }

}} on:submit={handleFormSubmit}>
    <textarea bind:this={commentTextArea} name="comment-content" placeholder="Add comment..."></textarea>
    <button bind:this={submitBtn} class="submit-btn" type="submit">Comment</button>
    <input type="hidden" name="post_id" value={`${postId}`}/>
</form>

{#if errorMessage.length > 0}
  <p class="error-message">{errorMessage}</p>
{/if}


<style>

    form{
        width: 100%;
        display: grid;
        gap: 1rem;
        flex-wrap: wrap;
    }
    textarea{
        padding: 1rem;
        border-radius: 1rem;
        flex-basis: 100%;
        height: auto;
        box-shadow: -2px -2px 6px -4px rgba(226, 224, 224, 0.5) inset, 2px 2px 6px 4px rgba(0, 0, 0, 0.5) inset;
        background-color: transparent;
        border: none;
        color: inherit;
        font: inherit;
        resize: none;
        transition: border-radius 0.5s;
    }

    .submit-btn{
        /**dont ask*/
        font-size: .875rem;
        border: none;
        background-color: var(--action);
        padding: 0.5rem 1rem;
        color: inherit;
        justify-self: flex-end;
    }

    .submit-btn:disabled{
        background-color: gray;
    }
    .error-message{
        color: red;
    }
</style>