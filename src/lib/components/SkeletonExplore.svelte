<!-- SkeletonExplore.svelte -->
<div class="skeleton-container">
  <div class="skeleton-header"></div>
  <div class="skeleton-grid">
    {#each Array(3) as _} 
      <div class="skeleton-user">
        <div class="skeleton-image"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text small"></div>
      </div>
    {/each}
  </div>
</div>
{#each Array(9) as _, index} 
<div class="skeleton-post">
  <div class="skeleton-post-image"></div>
  <div class="skeleton-post-details">
    <div class="skeleton-text wide"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text small"></div>
  </div>
</div>
{/each}



<style>
  .skeleton-post {
  background-color: var(--text-secondary);
  border-radius: 8px;
  padding: 10px;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
}

.skeleton-post-image {
  height: 150px; 
  background-color: var(--background);
  border-radius: 8px;
  margin-bottom: 8px;
}

.skeleton-post-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.skeleton-text {
  height: 10px;
  background-color: #ccc;
  margin-top: 4px;
  border-radius: 4px;
}

.skeleton-text.wide {
  width: 100%; 
}

.skeleton-text.small {
  width: 50%; 
}
  .skeleton-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .skeleton-header {
    height: 20px;
    width: 80%;
    background-color: var(--text-secondary);
    border-radius: 8px;
  }
  .skeleton-grid {
    display: grid;
    gap: 0.3rem;
    grid-auto-flow: column;
    grid-auto-columns: minmax(10rem, 1fr);
  }
  .skeleton-user {
    background-color: var(--text-secondary);
    height: 120px;
    border-radius: 0.75rem;
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    align-items: center; 
    justify-content: center; 
}
.skeleton-image {
    width: 1.8rem;
    height: 2rem;
    border-radius: 50%;
    background-color: #e0e0e0;
    margin-bottom: 4px; 
}

.skeleton-text {
    height: 10px;
    background-color: #e0e0e0;
    width: 70%; 
    border-radius: 4px;
    margin-bottom: 4px; 
}

.skeleton-text.small {
    width: 50%; 
}
  @keyframes skeleton-loading {
  0% {
    background-color: #999999;
  }
  100% {
    background-color: #737575;
  }
}

.skeleton-text, .skeleton-image,.skeleton-post-image {
  animation: skeleton-loading 2s ease-in-out infinite alternate;
}
</style>
