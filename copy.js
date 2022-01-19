const path = require('path');
const fs = require('fs-extra');

function createFolder(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}

function deleteFolder(p) {
  console.log('Deleting folder: ' + p)
  if (fs.existsSync(p)) {
    fs.rmdirSync(p, { recursive: true });
  }
}

function copyFile(name, srcDir, destDir, destName) {
  console.log('Copy file: ' + name);
  destName = destName || name;
  fs.copyFileSync(path.join(srcDir, name), path.join(destDir, destName));
}
const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error("Need base directory of Rancher Dashboard repository to copy font to");
  process.exit(0);
}

const src = path.resolve(process.cwd(), 'dist', 'icons');

const dest = path.resolve(args[0]);
console.log('Copying font files to Rancher Dashboard UI: ' + dest);

// Check the folder exists
const iconDest = path.resolve(dest, 'node_modules', 'rancher-icons');

if (!fs.existsSync(iconDest)) {
  console.error(`Folder ${iconDest} does not exist - are you sure the folder you specified is a Rancher Dashboard folder?`);
  process.exit(0);
}

console.log('Removing existing icon font folder');
deleteFolder(iconDest);
createFolder(iconDest);

// Copy the folder contents
fs.copySync(src, iconDest)
