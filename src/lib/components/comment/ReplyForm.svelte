<script lang="ts">
    import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  
      export let commentId:string;
      export let postId:string;
      let errorMessage:string = "";
      let commentTextArea:HTMLTextAreaElement;
      let submitBtn:HTMLButtonElement;
      export let replyErrorMessage:string = "";

      const handleFormSubmit = () =>{
            replyErrorMessage = "";
            if(!submitBtn.disabled)
            submitBtn.disabled = true;
      }
  </script>
  
  
  <form method="post" action="/?/reply" use:enhance={()=>{
    return async({result})=>{
        submitBtn.disabled = false;
        if(result.type==="error"){
            replyErrorMessage = "Failed to send comment";
        }
        else if (result.type === "success"){
            replyErrorMessage = "";
            commentTextArea.value = "";
            commentTextArea.focus();
            invalidate("/post/"+postId + "/" + commentId)

        }
    }

}} on:submit={handleFormSubmit}>
      <textarea bind:this={commentTextArea} name="reply-content" placeholder="Add reply..."></textarea>
      <button bind:this={submitBtn} class="submit-btn" type="submit">Reply</button>
      <input type="hidden" name="parent_comment_id" value={`${commentId}`}/>
      <input type="hidden" name="postId" value={`${postId}`}/>
      
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
          width: 25%;
          justify-self: flex-end;
      }

        .submit-btn:disabled{
            background-color: gray;
        }
        .error-message{
            color: red;
        }
  </style>