<script lang="ts">
  import "../../../global.css";
  import SideBarBtn from "./SideBarBtn.svelte";

  export let user: string | undefined;
</script>

<ul class="box-shadow">
  <a href="/"
    ><li class="icon-container">
      <SideBarBtn imgRoute={"home.png"} name={"Home"} />
    </li></a
  >
  <a href="/explore-loading">
    <li class="icon-container">
      <SideBarBtn imgRoute={"search.png"} name={"Explore"} />
    </li></a>
  <a href="/groups">
  <li class="icon-container">
    <SideBarBtn imgRoute={"inbox.png"} name={"Groups"} />
  </li></a>
  <a href={user ? `/users/${user}` : "/login"}
    ><li class="icon-container">
      <SideBarBtn username={user} imgRoute={"profile.png"} name={"Profile"} />
    </li></a
  >

  <a href="/notifications"
    ><li class="icon-container">
      <SideBarBtn imgRoute={"notification-bell.png"} name={"Notifications"} />
    </li></a
  >
  <a href="/settings/profilesetting"
    ><li class="icon-container">
      <SideBarBtn imgRoute={"settings.png"} name={"Settings"} />
    </li></a
  >

</ul>

<style>
  ul {
    list-style: none;
    display: grid;
    text-align: center;
    background: transparent;
    border-radius: 8px;
    padding: 1rem 1.75rem;
    height: 80vh;
    grid-template-columns: repeat(1, 3rem);
    grid-template-rows: repeat(4, auto) 1fr;
    justify-items: center;

    grid-auto-rows: min-content;
    gap: 1.5rem;

    justify-self: end;
    width: fit-content;

    /** prevents the active::before from exploding*/
    align-items: baseline;
  }

  ul a {
    text-decoration: none;
    color: inherit;
  }

  
  ul li:nth-child(5) {
    align-self: end;
  }


  @media(max-width:1326px){
    ul{
      justify-self: center;
    }
  }

  @media(max-width:968px){
    ul{
      display: none;
    }
  }

</style>
