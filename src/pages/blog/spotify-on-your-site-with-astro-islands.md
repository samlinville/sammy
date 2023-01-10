---
layout: "../../layouts/BlogPost.astro"
title: "Display your currently playing Spotify track on an Astro.build site"
description: "Taking Astro Islands for a test drive"
pubDate: "Jan 6, 2023"
heroImage: "/placeholder-hero.jpg"
---

Over the Christmas holiday, I decided to try and port my blog from Eleventy to [Astro](https://astro.build/), just to test Astro out. At first, I wasn't planning on actually using the Astro blog long term, but the developer experience was just..._really good._ So I'm keeping it! This site is now built on Astro.

In particular, Astro has a feature called [Astro Islands](https://docs.astro.build/en/concepts/islands/), that let you embed a component from a variety of the "heavy duty" front-end frameworks like React, Vue, or Svelte when you need a bit more ✨interactivity✨ on the page. When Astro builds the site, it pre-renders the component to HTML and bundles only the necessary client-side JS to run that component's interactive features, so you don't need to send a ton of React code to the browser just to render an element. To test this out, I decided to hack together a little Spotify widget that shows the song I'm currently listening to.

## Getting data from Spotify

Spotify's developer APIs are, like, not the best. You need to do a little bit of cURL-ing to get the right credentials, but after that it's not too bad. I'll go through those steps below.

To prevent the client from ever receiving your Spotify OAuth credentials, we'll spin up a tiny Express API in [Fly.io](https://fly.io) to pass the Spotify data to the client. Ultimately I'd like to use a Vercel Edge Function for this, but this was the easiest way for me to do the experiment so just roll with me for now. When I get around to porting this over to an Edge Function, I'll update this post.

To follow along, you can clone [my repo](https://github.com/samlinville/spotify-api-service) from GitHub.

### Create a Spotify Refresh Token

In order to get the currently playing song from a Spotify account, you need to be authenticated. The credential you're looking to end up with is a Spotify Refresh Token, which you generate manually. I followed [this great guide from Ben Wiz](https://benwiz.com/blog/create-spotify-refresh-token/) to do that.

When you complete these steps, save your credentials in a `.env` file. Make sure your `.gitignore` file excludes `.env` from being committed to your repo. Your `.env` should look like this:

```
CLIENT_ID={replace_with_your_client_id}
CLIENT_SECRET={replace_with_your_client_secret}
REFRESH_TOKEN={replace_with_your_refresh_token}
```

### Build a tiny API

Now that we can query Spotify for our currently playing song, we can quickly shim together an Express API to provide a public endpoint to our client browsers that doesn't require any secrets. Running a completely public, unauthenticated API is probably (definitely) not the best practice here, and if I keep this widget on my site long-term, I'll come up with a better solution. This is just an experiment, though, remember?

I found some code from [this repo by Steve Hayes](https://github.com/stvehayes/spotify-currently-playing) that pretty elegantly uses the secrets we fetched above to grab the currently playing song from Spotify. It was originally implemented as a React component, so I adapted it to just be vanilla Node.js.

Again, you can find the code for this Express API [on GitHub](https://github.com/samlinville/spotify-api-service), I won't go through the process of writing it here.

Lastly, deploy it to Fly.io. No instructions needed here, Fly have made this astonishingly simple. If it all worked out, you should be able to hit `https://your-fly-project.fly.io/spotify/current` and see the song that's currently playing on your Spotify account.

## Building an Astro Island

Okay, that was all background work. Now let's put a Svelte component into an Astro website! Create a file in your Astro `/components` folder called `CurrentlyPlaying.svelte`. This is what that component looks like. I've stripped out all of the CSS to make it a good starting point for others— you can add in whatever works for your design. Let's walk through what it does.

Svelte components always start with `<script></script>` tags, where the component logic lives. Here, we describe some functions that will call our Fly.io API when the component loads, and then set up some logic to check back in with the API once per minute to keep the current song up to date as long as the page is active in the browser.

One note: everything between my `<script></script>` tags below is pretty kludgy, so if you're good at writing Svelte components, don't judge me too harshly. In the next few weeks, I want to look through the Svelte docs and update this code to be a bit cleaner. It works, though!

After the component logic, we render the component HTML. That's pretty straightforward, and it only renders if `visible` is true— if we have a song to display.

```html
<script>
  import { fade } from "svelte/transition";

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

  async function getCurrentSong() {
  const res = await fetch(`https://your-spotify-api.fly.dev/spotify/current`);
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
<div in:fade out:fade>
  <img src="{artwork}" alt="Album art for the song {song} by {artist}"
  <p>{song}</p>
  <p>{artist}</p>
</div>
{/if}

<style></style>
```

## Using a Svelte component in an Astro component

Now that we have a working Svelte component, we can add it into our existing Astro site. In my implementation, the component is placed in my page header, so I've put it in my `Header.astro` component.

Astro will attempt to completely render the component to static HTML when the site builds, but this component needs to fetch some dynamic data. As a result, we need to tell Astro to include the Javascript we wrote between our `<script>` tags in the Svelte component. To do that, we reference the component in `Header.astro` like so:

```
---
import CurrentlyPlaying from './CurrentlyPlaying.svelte';
---
<header>
...
  <CurrentlyPlaying client:only />
...
</header>
```

Adding `client:only` to the component tag tells Astro that all of the component's logic should be sent to the client, rather than rendered out at build time.

And that's basically it! The really cool thing about Astro Islands is that right next to this Svelte component, I could be using a React component or a Vue component. You can even pass data into them with `props` (which we didn't need to do here), or use Astro's state features to let the components from different frameworks interact with each other.

I'm looking forward to how Astro Islands will let me level up some of my blog posts. I have ideas for posts that include dynamic UI components to help illustrate concepts. With Astro, I can write my posts in `.mdx` files, and reference those components right inside my markdown.
