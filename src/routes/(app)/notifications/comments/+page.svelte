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

    {#each notifications as notification}
        <Notification {notification}/>
    {/each}
{/await}