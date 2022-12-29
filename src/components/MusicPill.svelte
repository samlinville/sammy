<script>
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
    <p class="musictitle text-xs text-zinc-200 transition-colors duration-300 leading-0 mb-0">Loading...</p>
{:then song}
    <p class="musictitle text-xs text-zinc-200 transition-colors duration-300 leading-0 mb-0">{song.title}</p>
    <p class="musicartist text-xs text-zinc-400 transition-colors duration-300 leading-0 mb-0">{song.artist}</p>
{:catch error}
    <p class="musictitle text-xs text-zinc-200 transition-colors duration-300 leading-0 mb-0">Nothing playing</p>
{/await}        

