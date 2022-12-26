# API Documentation

This API is built using [Hono](https://honojs.dev) and serves as a simple example of how to use the framework. It is hosted at the following URL:

`https://twitter-threads.productsway.com`

## Endpoints

### `GET /`

Returns a simple HTML page with the message "Hello Hono!".

### `GET /api/thread/:id`

Gets a tweet and its associated thread by its ID.

#### Parameters

- `id` (string) - The ID of the tweet to retrieve.

#### Response

Returns a JSON object with the following properties:

- `data` (object) - An object containing information about the tweet. The properties of this object are:
  - `id` (string) - The ID of the tweet.
  - `edit_history_tweet_ids` (array) - An array of tweet IDs for the tweets in the thread.
  - `text` (string) - The text of the tweet.
  - `author_id` (string) - The ID of the tweet's author.
  - `created_at` (string) - The date and time when the tweet was created.
- `includes` (object) - An object containing additional data related to the tweet. The properties of this object are:
  - `users` (array) - An array of objects containing information about the users mentioned in the tweet. The properties of these objects are:
    - `id` (string) - The ID of the user.
    - `name` (string) - The name of the user.
    - `profile_image_url` (string) - The URL of the user's profile image.
    - `username` (string) - The username of the user.

### `GET /api/video/:id`

Gets a video by its ID.

#### Parameters

- `id` (string) - The ID of the video to retrieve.

#### Response

Returns a JSON object with the following properties:

- `meta` (object) - An object containing metadata about the video. The properties of this object will vary depending on the video. An example response is shown below:

```
{
  "meta": {
    "theme-color": "#7FFFD4",
    "og:site_name": "vxTwitter",
    "twitter:card": "player",
    "twitter:title": "Matt Pocock (@mattpocockuk) ",
    "twitter:image": "0",
    "twitter:player:width": "1920",
    "twitter:player:height": "1080",
    "twitter:player:stream": "https://video.twimg.com/ext_tw_video/1591011883259133952/pu/vid/1280x720/oM3LZAIR79Ytr-3i.mp4?tag=12",
    "twitter:player:stream:content_type": "video/mp4",
    "og:url": "https://video.twimg.com/ext_tw_video/1591011883259133952/pu/vid/1280x720/oM3LZAIR79Ytr-3i.mp4?tag=12",
    "og:video": "https://video.twimg.com/ext_tw_video/1591011883259133952/pu/vid/1280x720/oM3LZAIR79Ytr-3i.mp4?tag=12",
    "og:video:secure_url": "https://video.twimg.com/ext_tw_video/1591011883259133952/pu/vid/1280x720/oM3LZAIR79Ytr-3i.mp4?tag=12",
    "og:video:type": "video/mp4",
    "og:video:width": "1920",
    "og:video:height": "1080",
    "og:image": "0",
    "og:description": "🔥 TypeScript Tip 🔥\n\nUsing union types can make your types more accurate, but each approach has pro&#39;s and con&#39;s.\n\nHere, we compare a normal union, a discriminated union, and a type predicate. Which do you prefer?"
  }
}
```
