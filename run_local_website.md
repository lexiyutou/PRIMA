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
