<script lang="ts">
  import { onMount } from "svelte";
  import SearchBar from "./SearchBar.svelte";
  import { page } from "$app/stores";
    import { fly, slide } from "svelte/transition";
  import { quintIn, quintInOut, quintOut } from "svelte/easing";
  import type { groupsTable } from "$lib/server/schema";
  import { writable } from 'svelte/store'; 
  import { goto } from "$app/navigation";
    export let groups: typeof groupsTable.$inferSelect[];
    
    let displayCategories: boolean = false
    let displayGroups: boolean = false;
    let currentLocation:string = "";
   
let selectedCategories = writable<string[]>([]);

function toggleCategory(category: string): void {
  selectedCategories.update(current => {
    const index = current.indexOf(category);// if we dont find any category we just retrun -1 which means no cateegory is currently selcted
    if (index === -1) {
      return [...current, category];
    } else {
      return current.filter((_, i) => i !== index);// and here it will include all categories in the new list except the once that already mathched so if u have "happy" selected if u press it again it will update the list and unselect it so removitn category from the list
    }
  });
}

$: theurl = `/home/categories?categories=${$selectedCategories.join(',')}`;

function gotourl() {
    goto(theurl);
}
    const toggleCategories = () =>{
        displayCategories = !displayCategories;
        displayGroups = false;
    }

    const toggleGroups = () =>{
        displayCategories = false;
        displayGroups = !displayGroups;
    }
    onMount(()=>currentLocation=window.location.pathname)

    $:{
        let path = $page.url.pathname.split("/")
        currentLocation = path[1]
        currentLocation = currentLocation
    }

</script>
<SearchBar/>
<div class="categories-header">
    <a href="/"><button class:active={currentLocation.length === 0}>For You</button></a>
    <a href="/following"><button class:active={currentLocation === "following"}>Following</button></a>
</div>
<div class="btns-container">
   <button class="categories" class:active-btn={displayCategories} on:click={toggleCategories}>Categories</button>
    <button class="groups" class:active-btn={displayGroups} on:click={toggleGroups}>Groups</button> 
</div>


{#if displayCategories}
<ul in:slide={{duration: 500, axis: 'y', }} out:slide={{duration: 300, axis: 'y'}}>
    <li>
   <button on:click={() => toggleCategory('happy')} class:active={$selectedCategories.includes('happy')}>
      happy
    </button>
  </li>
  <li>
    <button on:click={() => toggleCategory('sad')} class:active={$selectedCategories.includes('sad')}>
      sad
    </button>
  </li>
  <li>
    <button on:click={() => toggleCategory('comedy')} class:active={$selectedCategories.includes('comedy')}>
      comedy
    </button>
  </li>
  <button class="submit-btn" type="submit" on:click={gotourl}>Post</button>
</ul>
{/if}

{#if displayGroups}
<ul in:slide={{duration: 500, axis: 'y', }} out:slide={{duration: 300, axis: 'y'}}>
    {#if groups.length > 0}
        {#each groups as group}
            <a href={`/home/groups/${group.id}`}><li>{group.name}</li></a>
        {/each}
    {:else}
        <p>No groups joined.</p>
    {/if}
</ul>
{/if}


<style>
    a{
        all:unset;
        cursor: pointer;
    }
    .categories-header{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
    }
    
    ul{
        margin-top: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        list-style: none;
    }

    li{
        /* box-shadow: 2px 0px 6px -5px rgba(226, 224, 224, 0.5) inset,
              0px 0px 5px 0px rgba(0, 0, 0, 0.5);
        padding: 1rem;
        border-radius: 16px; */
        font-size: 1rem;
        padding: 0.1rem 1rem;
        border-radius: 10px;
        background: #131313;
        box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.50), -3px -3px 10px 0px rgba(255, 255, 255, 0.03);
        min-width: fit-content;
    }

    button{
        border: 0;
        color: var(--text-secondary);
        font-size: 1.2rem;
    }

    .btns-container{
        justify-self: center;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        width: 100%;
    }

    .categories, .groups{
        color: inherit;
        font-size: 0.8rem;
        padding: 0.75rem;
        border: 1px solid var(--action);
    }

    .active-btn{
        background-color: var(--action);
    }

    .active{
        position: relative;
        color:var(--text);
    }

    .active::before{
        position: absolute;
        content: "";
        width: 100%;
        height: 1px;
        top: 10;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--action);
        filter: drop-shadow(0px 0px 5px rgba(108, 92, 214, 0.50));
    }
</style>