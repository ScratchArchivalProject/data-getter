# Scratch Data Getter
This is the repository for the Scratch Archival Project's mass Scratch project fetcher and logger. If you're looking for the program that downloads project SB3s, please refer to [project-downloader](https://github.com/ScratchArchivalProject/Project-Downloader).

## Installing
1. Install dependencies
```sh
npm i
```
2. Compile and run
```sh
npm run dev
```

## Configuration
There are a few configurable things that you can edit, located in [`src/index.ts`](./src/index.ts).
1. `start`: ID to begin fetching on.
2. `limit`: ID to end the process on, inclusively. Use `null` to continue forever.

## License
[MIT License](./LICENSE)
