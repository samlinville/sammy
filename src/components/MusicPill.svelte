<script>
  import { fade } from "svelte/transition";
  import Disc from "../assets/images/disc.png";
  import getCurrentSong from "./lib/get-song";

  let visible = false;
  let song = null;
  let artist = null;
  let artwork = null;
  let songPlaying = false;
  let pageVisible = true;

  //fetch the initial song status
  getSong();

  //monitor whether the user is actively viewing the page
  //immediately refetch song when user returns to the page
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      pageVisible = false;
    } else if (document.visibilityState === "visible" && !pageVisible) {
      pageVisible = true;
      getSong();
    }
  });

  //refetch the song every 60 seconds only if the user is viewing the page
  setInterval(() => {
    if (pageVisible) {
      getSong();
    }
  }, 60000);

  //call our async lib function that retrieves the song from our api
  //and then update our state with the song metadata
  function getSong() {
    getCurrentSong().then((data) => {
      try {
        song = data.title;
        artist = data.artist;
        songPlaying = data.isPlaying;
        artwork = data.albumImageUrl;
        visible = true;
      } catch {
        visible: false;
      }
    });
  }
</script>

{#if visible}
  <!-- <div class="relative"> -->

  <!-- </div> -->

  <div
    in:fade
    out:fade
    class="hidden sm:visible sm:flex items-center justify-center musicpill transition-all duration-300 border rounded-full border-zinc-800 hover:border-zinc-600 pl-1 py-1 pr-6 bg-zinc-900"
  >
    <!-- <img
      alt="An 8-bit pixel art of a compact disc rotating"
      class="{songPlaying ? 'rotate' : ''} h-[35px] duration-300"
      src={Disc}
    /> -->
    <div class="relative">
      <img
        src={artwork}
        alt="Album art for the song {song} by {artist}"
        class="z-10 absolute top-0 left-0 ml-[16px] h-[35px] rounded-sm drop-shadow-[-5px_0_5px_rgba(0,0,0,0.6)]"
      />
      <img
        alt="An 8-bit pixel art of a compact disc rotating"
        class="z-0 {songPlaying ? 'rotate' : ''} h-[35px] duration-300"
        src={Disc}
      />
    </div>
    <div class="ml-8">
      <p
        class="max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden font-mono musictitle text-xs text-zinc-200 transition-all duration-300 leading-0 mb-0"
      >
        {song}
      </p>
      <p
        class="max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden font-mono musicartist text-xs text-zinc-400 transition-all duration-300 leading-0 mb-0"
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
