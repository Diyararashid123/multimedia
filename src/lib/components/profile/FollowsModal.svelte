<script lang="ts">
  import LoadingSpinner from "../LoadingSpinner.svelte";
    export let userId:string;
    export let isPrivate:boolean | null;
    export let type: string;
    export let toggleFunc;
    
    const fetchData = async () => {
        if(!isPrivate) return Promise.reject("Private account");
        const response = await fetch(`/api/fetch-follows/${type}?userId=${userId}`);
        const data = await response.json();
        console.log(data)
        if(data.error) return Promise.reject("Failed to fetch data");
        return data.data
    }

    let promise: Promise<any> = fetchData();

    
</script>

<button on:click|self={toggleFunc}>
    <div class="users-container">
        {#await promise}
            <LoadingSpinner />
        {:then followers}
            {#if followers.length > 0}
                {#each followers as user}
                    <a on:click={toggleFunc} href={`/users/${user.username}`}>
                        <div class="user">
                            <img src={user.profilePic} alt="profile" />
                            <p>{user.username}</p>
                        </div>
                    </a>
                {/each}
            {:else}
                <p>No {type}</p>
            {/if}
        {:catch error}
            <p>{error}</p>
        {/await}
    </div>
</button>



<style>
    button{
        all: unset;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        display: grid;
        place-items: center;
        z-index: 100;
    } 
    .users-container {
        background-color: var(--background);
        color: white;
        height: 40%;
        width: 25%;
        border: none;
        border-radius: 16px;
        padding: 1.25rem;
        display: grid;
        grid-template-rows: repeat(1, min-content);
        gap: 1rem;
        overflow-y: auto;
    }
    .user{
        display: flex;
        gap: 1rem;
        align-items: center;
    }
    .user:hover{
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        cursor: pointer;
    }
    a{
        color: white;
        text-decoration: none;
    }
    img{
        width: 3rem;
    }
</style>