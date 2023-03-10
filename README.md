# Twitter Threads App

Twitter Threads App helps you read and share Twitter threads easily!

[![IT Man - Tech #30 - Deno 101 - The best developer experience [Vietnamese]](https://i.ytimg.com/vi/ocLNcwm4xUs/hqdefault.jpg)](https://www.youtube.com/watch?v=ocLNcwm4xUs)

[![ITMan - Tech #25 - Ultrafast web framework for Cloudflare Workers, Deno, and Bun [Vietnamese]](https://i.ytimg.com/vi/YsjqVvlrXGY/hqdefault.jpg)](https://www.youtube.com/watch?v=YsjqVvlrXGY)

## 🏠 [Homepage](https://twitter-threads.productsway.com)

### ✨ [Demo](https://twitter-threads.productsway.com/static/doc.html)
## [API Documentation](api.md)
 - [GET /api/thread/:id](https://github.com/jellydn/twitter-threads-app/blob/main/api.md#get-apithreadid)
 - [GET /api/video/:id](https://github.com/jellydn/twitter-threads-app/blob/main/api.md#get-apivideoid)

## Features

- Minimal
- TypeScript
- [Deno — A modern runtime for JavaScript and TypeScript](https://deno.land/) to develop and deploy.
- [elbywan/wretch: A tiny wrapper built around fetch with an intuitive syntax.](https://github.com/elbywan/wretch)
- [sindresorhus/promise-fun: Promise packages, patterns, chat, and tutorials](https://github.com/sindresorhus/promise-fun)

## Usage

#### Initialize

```sh
git clone https://github.com/jellydn/twitter-threads-app
```

### Develop

Create .env file from .env.example then run below command

```sh
deno task dev
```

### Test

```sh
deno task test
```

### Deploy

Install deployctl: the command line tool for Deno Deploy.

```sh
deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -r -f https://deno.land/x/deploy/deployctl.ts
```

Then

```sh
deployctl deploy --project=twitter-threads-app ./main.ts
```

## Useful links

- Hono https://honojs.dev
- Hono examples: https://github.com/honojs/examples

## Author

👤 **Dung Huynh**

- Website: https://productsway.com/
- Twitter: [@jellydn](https://twitter.com/jellydn)
- Github: [@jellydn](https://github.com/jellydn)

## Show your support

[![kofi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/dunghd)
[![paypal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/dunghd)
[![buymeacoffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/dunghd)

Give a ⭐️ if this project helped you!
