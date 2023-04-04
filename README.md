# Olive

Olive is a digital typewriter app for MacOS (also Windows and Linux, but untested).
It is not meant to perfectly simulate using a typewriter (the way some skeuomorphic
typewriter apps do), but rather bring the workflow into the digital age. There is
no copy-pasting, no editing, and correcting mistakes is tedious. That's the fun part.


## Local development

Start by installing the project dependencies (note: I have not gotten [Bun](bun.sh)
to work here, so you will need to use NPM).

```bash
npm install
```

To boot-up the application locally, run:

```bash
npm run dev
```

You can also run `npm run build:mac` to test the full build locally (specifically
building the application for MacOS). To build for all platforms (Windows, MacOS,
and Linux), run:

```bash
npm run build
```


### Project structure

Here is a mini-map of the project to help get your barrings:

```bash
├── icon/                 # icon files (ico, icns, png) are automatically used for app icon
├── scripts/              # build scripts
└── src/
    ├── main/
    │   ├── main.ts       # the "app" side (menu bar, reading/writting files, etc)
    │   └── ...
    └── renderer
        ├── App.vue       # the Vue app rendered (SPA)
        ├── components/   # take a wild guess what's in this one
        └── public/       # assets like fonts and sound files
```


## Todo

- customize font
- refine color palette
- refactor and document
- chores: lint, update deps
- figure out code signing (...auto-updating?)
