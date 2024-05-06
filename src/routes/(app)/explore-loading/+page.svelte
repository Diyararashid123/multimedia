<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import SkeletonExplore from '$lib/components/SkeletonExplore.svelte';

  onMount(() => {
    setTimeout(() => {
      goto('/explore');  
    }, 1000);  
  });
</script>


<SkeletonExplore />  
