# Efiz Copy Folder Drive

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Google Apps Script CLI (clasp): `npm install -g @google/clasp`
- Google account linked to clasp

## Features

- ✅ TypeScript support
- ✅ npm for dependency management
- ✅ ESLint for code quality
- ✅ Best practices file structure
- ✅ Pre-configured clasp
- ✅ Deployment scripts

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**
Run the command below to install all the necessary dependencies. Do it in the root directory and the subdirectories (client and server).

   ```bash
   npm install
   ```

3. **Link to your Apps Script project**

   Make sure you have a Google Apps Script project created in the cloud.

   ```bash
   clasp login
   clasp link <script-id>
   ```

   *Replace `<script-id>` with your actual Apps Script project ID.*

4. **Pull the Google Apps Script project**
Run a clasp pull to download the Google Apps Script project files (even if they are empty) so you can have the appsscript.json file locally and make future pushes without errors.

```bash
clasp pull
```

## Configuration

Update the `clasp.json.example` file and rename it to `clasp.json` with your project's configuration:

```json
{
  "scriptId": "YOUR_SCRIPT_ID",
  "rootDir": "./dist"
}
```

## Development

### Compile and push to Google Apps Script project

```bash
npm run deploy
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run build` | Compile the index.html file and the backend.js file (no push to cloud) |
| `npm run deploy` | Compile and push all files to Google Apps Script cloud |
| `npm run push-client` | Compile and push only the frontend HTML file to Google Apps Script |
| `npm run push-server` | Compile and push only the backend file to Google Apps Script |

## Customization

- Add new entry points in `src/`
- Configure ESLint rules in `.eslintrc.js`
- Update deployment settings in `clasp.json`

## Troubleshooting

**Clasp authentication issues:**

```bash
clasp logout
clasp login
```

**Deployment failed:**
Check `clasp.json` for correct `scriptId` and verify you have permissions

## License

MIT License
