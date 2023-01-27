async function getCurrentSong() {
  const res = await fetch('https://sammy-services.phoenix-cobra.ts.net/spotify/current', {
    method: 'GET',
    withCredentials: true,
    crossorigin: true,
  });
  const msg = await res.json();
  const data = msg.message;
  if (res.ok) {
    return data;
  } else {
    throw new Error(data);
  }
}

export default getCurrentSong;