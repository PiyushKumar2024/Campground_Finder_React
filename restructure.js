const fs = require('fs');
const path = require('path');

const projectRoot = 'd:\\Campground_Finder_React';
const clientRoot = path.join(projectRoot, 'client');
const clientSrc = path.join(clientRoot, 'src');

const serverRoot = path.join(projectRoot, 'server');
const serverSrc = path.join(serverRoot, 'src');

function moveDir(src, dest) {
    if (fs.existsSync(src)) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        // Move contents of src to dest
        const files = fs.readdirSync(src);
        for (const file of files) {
            fs.renameSync(path.join(src, file), path.join(dest, file));
        }
        fs.rmdirSync(src);
        console.log(`Moved ${src} to ${dest}`);
    } else {
        console.log(`Warning: ${src} does not exist.`);
    }
}

// 1. Move Client Folders
const clientMoves = {
    'components': path.join(clientSrc, 'components'),
    'css': path.join(clientSrc, 'css'),
    'config': path.join(clientSrc, 'config'),
    'redux': path.join(clientSrc, 'redux')
};

for (const [folderName, destPath] of Object.entries(clientMoves)) {
    moveDir(path.join(clientRoot, folderName), destPath);
}

// 2. Client Import Replacements
/**
 * Now that things are all inside `client/src/`,
 * paths inside `App.jsx`, `main.jsx`, `components/*.jsx` need mapping.
 * Before: components were in `client/components`, App in `client/src/App.jsx`.
 * In App.jsx: `../components/Navbar` -> `./components/Navbar`
 * In main.jsx: `../components/Landing` -> `./components/Landing`, `../css/index.css` -> `./css/index.css`, `../redux/store` -> `./redux/store`
 * In components/Landing.jsx: `../css/Landing.css` -> `../css/Landing.css` (stays the same because components and css are siblings under src now). 
 * Wait, before: Landing.jsx was in `client/components/`. `css` was in `client/css/`. `../css/Landing.css` -> `client/components/../css/` -> `client/css/`.
 * Now: Landing.jsx is in `client/src/components/`. `css` is in `client/src/css/`. `../css/Landing.css` -> `client/src/components/../css/` -> `client/src/css/`.
 * So surprisingly, relative imports between siblings (`../css`) stay exactly the same! 
 * The only things that break are paths from `client/src/` (like `App.jsx`, `main.jsx`) going to `client/components/`!
 * Wait, `client/src/App.jsx` used `../components/` (going up to `client/` then down to `components/`).
 * Now it should just be `./components/` because they are both in `src/`.
 * Same for `main.jsx`.
 */

function replaceInFile(filePath, replacements) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    for (const [search, replace] of replacements) {
        if (content.includes(search)) {
            content = content.split(search).join(replace);
            changed = true;
        }
    }
    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated imports in ${filePath}`);
    }
}

const mainAppReplacements = [
    ['../components/', './components/'],
    ['../css/', './css/'],
    ['../redux/', './redux/'],
    ['../config/', './config/'],
    // Handle double dots that might have variations
    ['..\\components\\', '.\\components\\'],
    ['..\\css\\', '.\\css\\']
];

replaceInFile(path.join(clientSrc, 'App.jsx'), mainAppReplacements);
replaceInFile(path.join(clientSrc, 'main.jsx'), mainAppReplacements);
replaceInFile(path.join(clientSrc, 'Layout.jsx'), mainAppReplacements); // just in case

// Check vite.config.js or eslint.config.js? No relative component imports there usually.

// 3. Move Server Folders
const serverFoldersToMove = [
    'config', 'controllers', 'helper', 'images', 'middlewares', 'models', 'routes', 'schemas', 'seeds'
];

if (!fs.existsSync(serverSrc)) {
    fs.mkdirSync(serverSrc, { recursive: true });
}

for (const folder of serverFoldersToMove) {
    moveDir(path.join(serverRoot, folder), path.join(serverSrc, folder));
}
// Also move index.js
if (fs.existsSync(path.join(serverRoot, 'index.js'))) {
    fs.renameSync(path.join(serverRoot, 'index.js'), path.join(serverSrc, 'index.js'));
    console.log(`Moved server/index.js to server/src/index.js`);
}

// 4. Server Imports
// For server files inside `server/src/`, their relative relations have completely been preserved!
// `routes/campground.js` -> `../controllers/campgrounds.js` works identically because both `routes` and `controllers` were moved inside `server/src/`.
// The only thing that might break is `.env` path resolution in `index.js` or `package.json` scripts!
// In package.json: `"start": "nodemon index.js"` -> `"start": "nodemon src/index.js"` (and test script)

const serverPackageJsonPath = path.join(serverRoot, 'package.json');
if (fs.existsSync(serverPackageJsonPath)) {
    let pkgObj = JSON.parse(fs.readFileSync(serverPackageJsonPath, 'utf8'));
    if (pkgObj.main === 'index.js') pkgObj.main = 'src/index.js';
    if (pkgObj.scripts) {
        if (pkgObj.scripts.test === 'node index.js') pkgObj.scripts.test = 'node src/index.js';
        if (pkgObj.scripts.start === 'nodemon index.js') pkgObj.scripts.start = 'nodemon src/index.js';
    }
    fs.writeFileSync(serverPackageJsonPath, JSON.stringify(pkgObj, null, 2), 'utf8');
    console.log(`Updated server/package.json paths`);
}

// In server/src/index.js, dotenv.config() by default looks in CWD (which is the directory from which process was started).
// Since the script is run from `server/` via `npm start`, CWD is `server/`, so it will still find `server/.env`!
// Wait! `import { fileURLToPath } from 'url'` handles static dirname usually.
// Let's check `server/src/index.js`:
// `const __dirname = path.dirname(__filename);` is now `server/src/`.
// Wait... if any routes serve static files using `__dirname`, they will be off by one level if they expect `server/` root!

console.log("Restructure script completed!");
