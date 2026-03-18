## Install runtime (Node.js / npm)

Recommended: use nvm to install and manage Node.js versions.

```bash
# Install nvm (skip if already installed)
export NVM_DIR="$HOME/.nvm"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi
. "$NVM_DIR/nvm.sh"

# Install and use Node.js 18 (includes npm)
nvm install 18
nvm use 18

# Verify npm is available
npm -v
```

## Install dependencies

Run this in the project root (the same directory as `package.json`).

```bash
npm install
```

## Run the app

```bash
npm start
```

Then visit http://localhost:3000

## Update the GitHub Pages site (`gh-pages` branch)

This repository keeps the website source code on `main` and publishes the built static site to `gh-pages`.

Before deploying, make sure the repository settings in GitHub Pages are:

- Branch: `gh-pages`
- Folder: `/ (root)`

Deploy the latest build with:

```bash
npm run deploy
```

What this does:

- runs `npm run build`
- creates or updates the `gh-pages` branch with the contents of `build/`
- pushes the published site to GitHub

Recommended workflow:

1. Commit your source code changes to `main`.
2. Test locally with `npm start` if needed.
3. Run `npm run deploy`.
4. Wait a minute for GitHub Pages to refresh, then visit https://lexiyutou.github.io/PRIMA

Notes:

- Do not manually edit the `gh-pages` branch. It is generated from the build output.
- `npm run deploy` only publishes the built website. It does not replace your normal source commits on `main`.
