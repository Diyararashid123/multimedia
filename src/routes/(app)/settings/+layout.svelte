<script lang="ts">
  import "../../../global.css"
  import Setting from "$lib/components/settings/Setting.svelte";


</script>

<main>
 
    <Setting/>
  <div>
 
      <div class="main-container">
    
          <div class="main-content">
              <slot/>
          </div>
      </div>
      
  </div>
</main>

<style>

  main {
      position: relative;
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(2, 1fr);
  }

  main > div{
      display: grid;
      gap: 3rem;
  }

  .main-container{
      justify-items: center;
      gap:1rem;
  }

  .main-content{
      display: grid;
      align-items: center;
      gap: 1rem;
      grid-template-columns: repeat(1, 100%);
  }

  @media(max-width: 1326px){
    main{
        grid-template-columns: repeat(1, 1fr);
    }
  }


</style>