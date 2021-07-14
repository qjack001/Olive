### Quick Start

Clone the repo, then run:

```bash
npm install      ## install all dependencies
npm run compile  ## compile app for distribution
```

The resulting binary will be outputted to the `dist/mac/` folder.

### Project Structure

- [`packages/main`](packages/main) contains the Electron [main script](https://www.electronjs.org/docs/tutorial/quick-start#create-the-main-script-file), set up all app behaviors/menu items/etc there.
- [`packages/renderer`](packages/renderer) contains the actual Vue app.
- [`icon`](icon) contains the app icons for macOS and Windows.
