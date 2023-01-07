<script>
  import { fade } from "svelte/transition";
  import Disc from "../assets/images/disc.png";

  let visible = false;
  let song = null;
  let artist = null;
  let songPlaying = false;
  let pageVisible = true;

  //fetch the initial song status
  getSong();

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      // console.log("page is hidden");
      pageVisible = false;
    } else if (document.visibilityState === "visible" && !pageVisible) {
      // console.log("page is visible again");
      pageVisible = true;

      // console.log("refreshed because you switched back to the tab");
      getSong();
    }
  });

  //refresh the song status every 20 seconds
  setInterval(() => {
    if (pageVisible) {
      // console.log("refreshed on timer b/c page visible");
      getSong();
    } else {
      // console.log("skipped reload bc tab unfocused");
    }
  }, 60000);

  function getSong() {
    getCurrentSong().then((data) => {
      try {
        song = data.title;
        artist = data.artist;
        songPlaying = data.isPlaying;
        visible = true;
      } catch {
        visible: false;
      }
    });
  }

  async function getCurrentSong() {
    const res = await fetch(`https://sammy-service.fly.dev/spotify/current`);
    const msg = await res.json();
    const data = msg.message;
    if (res.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }
</script>

{#if visible}
  <div
    in:fade
    out:fade
    class="hidden sm:visible sm:flex items-center justify-center musicpill transition-all duration-300 border rounded-full border-zinc-800 hover:border-zinc-600 pl-1 py-1 pr-6 bg-zinc-900"
  >
    <img
      alt="An 8-bit pixel art of a compact disc rotating"
      class="{songPlaying ? 'rotate' : ''} h-[35px] duration-300"
      src={Disc}
    />
    <div class="ml-4">
      <p
        class="font-mono musictitle text-xs text-zinc-200 transition-all duration-300 leading-0 mb-0"
      >
        {song}
      </p>
      <p
        class="font-mono musicartist text-xs text-zinc-400 transition-all duration-300 leading-0 mb-0"
      >
        {artist}
      </p>
    </div>
  </div>
{/if}

<style>
  .musicpill:hover .musictitle {
    @apply text-zinc-200;
  }

  .musicpill:hover .musicartist {
    @apply text-zinc-400;
  }

  .rotate {
    animation: rotation 1s infinite linear;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
</style>
