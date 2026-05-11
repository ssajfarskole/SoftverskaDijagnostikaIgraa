name: Deploy Vite Site to Pages

on:
  push:
    branches: ["main"]
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
concurrency:
  group: "pages"
  cancel-in-progress: true

env:
  # Opt-in to Node 24 to resolve the deprecation warning
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 22 # Stable LTS
          cache: 'npm'

      - name: Install dependencies
        run: npm ci || npm install

      - name: Build project
        run: npm run build
        env:
          # VITE CONFIG FIX: 
          # GitHub Pages URLs are usually: https://<user>.github.io/<repo>/
          # Your config uses BASE_PATH. Set your repo name here:
          BASE_PATH: /${{ github.event.repository.name }}/

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # MATCHING YOUR VITE CONFIG:
          # Your vite.config.ts sets outDir to "docs"
          path: './docs'

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
