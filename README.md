# Math Dash

A fast-paced math challenge game built with React, Vite, and Tailwind CSS.

## Deployment to Netlify via GitHub

To deploy this project to Netlify, follow these steps:

### 1. Push to GitHub
1. Create a new repository on GitHub.
2. Initialize git in your local project (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Link your local repository to GitHub:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

### 2. Connect to Netlify
1. Log in to [Netlify](https://www.netlify.com/).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Select **GitHub** and authorize Netlify.
4. Choose the `Math Dash` repository.
5. Netlify should automatically detect the settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click **"Deploy site"**.

### 3. Environment Variables
If your app uses API keys (like Gemini or Firebase), you must add them in Netlify:
1. Go to **Site settings** > **Environment variables**.
2. Add the following variables (refer to your `.env.example`):
   - `GEMINI_API_KEY`
   - Any Firebase configuration keys if applicable.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
