<script>
	import Disc from "../assets/images/disc.png"

    let promise = getCurrentSong();

	async function getCurrentSong() {
		const res = await fetch(`https://sammy-service.fly.dev/spotify/current`);
		const msg = await res.json();
		const data = msg.message
		if (res.ok) {
			return data;
		} else {
			throw new Error(data);
		}
	}
</script>



    {#await promise}
    <div class="hidden sm:flex sm:invisible items-center justify-center musicpill transition-all duration-300 border rounded-full border-zinc-800 hover:border-zinc-600 pl-1 py-1 pr-6 bg-zinc-900">
        <img alt="An 8-bit pixel art of a compact disc rotating" class="h-[35px] duration-300" src={Disc}>
        <div class="ml-4">
            <p class="font-mono musictitle text-xs text-zinc-200 transition-all duration-300 leading-0 mb-0">Loading...</p>
        </div>
    </div>
    {:then song}
    <div class="hidden sm:visible sm:flex items-center justify-center musicpill transition-all duration-300 border rounded-full border-zinc-800 hover:border-zinc-600 pl-1 py-1 pr-6 bg-zinc-900">
        <img alt="An 8-bit pixel art of a compact disc rotating" class="rotate h-[35px] duration-300" src={Disc}>
        <div class="ml-4">
            <p class="font-mono musictitle text-xs text-zinc-200 transition-all duration-300 leading-0 mb-0">{song.title}</p>
            <p class="font-mono musicartist text-xs text-zinc-400 transition-all duration-300 leading-0 mb-0">{song.artist}</p>
        </div>
    </div>
    {:catch error}
    <div class="hidden sm:flex sm:invisible items-center justify-center musicpill transition-all duration-300 border rounded-full border-zinc-800 hover:border-zinc-600 pl-1 py-1 pr-6 bg-zinc-900">
        <img alt="An 8-bit pixel art of a compact disc rotating" class="h-[35px] duration-300" src={Disc}>
        <div class="ml-4">
            <p class="font-mono musictitle text-xs text-zinc-200 transition-all duration-300 leading-0 mb-0">Nothing playing</p>
        </div>
    </div>
    {/await}        
    


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
      

