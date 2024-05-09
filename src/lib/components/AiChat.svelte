<script lang="ts">
  import { fade, slide } from "svelte/transition";
    import {AiChatStore} from "../helpers/stores"
  import { quartInOut, quartOut } from "svelte/easing";
  
  let chatInput: HTMLInputElement;
  let messagesContainer: HTMLDivElement;

  type Message = {
      text: string;
      from: "user" | "bot";
  }

  let messages: Message[] = [
      {
          text: "Hello, how can I help you?",
          from: "bot"
      },

  ]

  const handleInput = (event:any) =>{
        if(event.key === "Enter"){
            sendMessage()
            // messages.push({
            //     text: chatInput.value,
            //     from: "user"
            // })
            // messages = messages;
            // chatInput.value = ""
    
            // setTimeout(() => {
            //     messages.push({
            //         text: "I am a bot",
            //         from: "bot"
            //     })
            //     messages = messages;
            // }, 1000);
        }
  }

  const sendMessage = async() => {
    // Wait for the new message to be rendered xddd
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 0);
    
    chatInput.disabled = true;
    messages.push({
        text: chatInput.value,
        from: "user"
    })
    messages = messages;

    const _req = await fetch("/api/ai/profanity",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: chatInput.value
        })

    })
    const _res = await _req.json()
    if(_res.success && _res.response === "N"){
        messages.push({
            text: "Please do not use profanity",
            from: "bot"
        })
        messages = messages;

        setTimeout(() => {
            messages = messages.splice(0, 1)
            chatInput.value = ""
            chatInput.disabled = false;
        }, 1000);

        return
    }

    const req = await fetch("/api/ai/help", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: chatInput.value
        })
    })

    const res = await req.json()
    if(res.success){
        messages.push({
            text: res.message,
            from: "bot"
        })
        messages = messages;
        chatInput.value = ""
    }
    chatInput.disabled = false;
    chatInput.focus();

    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 0);
    
}
</script>

{#if $AiChatStore.active}
    <div class="chat box-shadow" in:slide={{duration: 300, axis: "x", easing:quartOut}} out:fade={{duration: 300, easing:quartInOut}}>
        <div bind:this={messagesContainer} class="messages-container">
            {#each messages as message}
                <div class="message" class:user={message.from === "user"} class:bot={message.from === "bot"}>
                    {#if message.from === "user"}
                        <span class="user-message">
                        {message.text}
                        <i class="fa-solid fa-user"></i>
                        </span>
                    {:else}
                        <span class="bot-message">
                        <i class="fa-brands fa-android"></i>
                        {message.text}
                        </span>
                    {/if}
                </div>
            {/each}
        </div>
        <input on:keyup={handleInput} bind:this={chatInput} type="text" placeholder="Ask a question"/>
    </div>
{/if}

<style>
    .chat{
        position: absolute;
        bottom: 5%;
        right: 1%;
        height: 40vh;
        width: 20vw;
        display: grid;
        grid-template-rows: 90% 10%;
        border-radius: 16px;
        padding: 1rem;
        padding-top: 0;
    }

    .messages-container{
        
        margin-bottom: 1rem;
        overflow-y: scroll;
    }

    .user{
        text-align: right;
    }

    .bot{
        text-align: left;
    }

    .message{
        margin: 1rem 0;
    }

    .user-message, .bot-message{
        display: inline-block;
        vertical-align: middle;
    }

    .user-message .fa-user, .bot-message .fa-android{
        vertical-align: middle;
    }

    .fa-user{
        transform: rotateY(180deg);
    }

    input{
        padding: 0.5rem;
        /*counteract the padding of the parent*/
        margin: 0 -1rem;
        border-radius: 8px;
        font-size: 1rem;

    }
</style>