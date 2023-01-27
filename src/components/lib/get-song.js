async function getCurrentSong() {
  const res = await fetch(`https://sammy-services.phoenix-cobra.ts.net/spotify/current`);
  const msg = await res.json();
  const data = msg.message;
  if (res.ok) {
    return data;
  } else {
    throw new Error(data);
  }
}

export default getCurrentSong;