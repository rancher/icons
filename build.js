const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const pkg = require('./package.json');
const svgtofont = require('svgtofont');
//const { optimize } = require('svgo');

const fontDist = path.resolve(process.cwd(), 'font');
const NAME = 'icons';

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

async function main() {

  const dist = path.resolve(process.cwd(), 'dist');
  deleteFolder(dist);
  createFolder(dist);

  const iconDist = path.resolve(dist, NAME);
  createFolder(iconDist);

  const iconFontDist = path.resolve(iconDist, 'fonts');
  createFolder(iconFontDist);

  await svgtofont({
    src: path.resolve(process.cwd(), 'svg'), // svg path
    dist: fontDist,
    fontName: NAME,
    css: {
      cssPath: 'fonts/',
    },
    svgicons2svgfont: {
      // fontHeight: 1000,
      normalize: true,
    },
    styleTemplates: path.resolve(process.cwd(), 'templates'),
    classNamePrefix: 'icon',
    cssPath: 'fonts',
    website: {
      title: 'Rancher Icons',
      logo: path.resolve(process.cwd(), 'icon.svg'),
      version: pkg.version,
      template: path.resolve(process.cwd(), 'index.ejs'),
    }
  });

  // Delete the files we don't need
  // fs.unlinkSync(path.join(fontDist, `${NAME}.symbol.svg`));
  // fs.unlinkSync(path.join(fontDist, `${NAME}.module.less`));
  // fs.unlinkSync(path.join(fontDist, `${NAME}.less`));
  // fs.unlinkSync(path.join(fontDist, `${NAME}.styl`));
  // fs.unlinkSync(path.join(fontDist, `${NAME}.woff2`));

  // Optimise the SVG

  // Create hash for font file
  const svgFile = fs.readFileSync(path.resolve(fontDist, `${NAME}.svg`));
  let sha1sum = crypto.createHash('sha1').update(svgFile).digest("hex");
  sha1sum = sha1sum.substr(0,8);
  console.log(sha1sum);

  // Render our own scss template for use in Rancher Dashboard

  // Move the files around to match what we use in Rancher Dashboard

  // Copy the font files we want
  copyFile(`${NAME}.svg`, fontDist, iconFontDist);
  copyFile(`${NAME}.ttf`, fontDist, iconFontDist);
  copyFile(`${NAME}.woff`, fontDist, iconFontDist);

  copyFile(`style.scss`, fontDist, iconDist);
  copyFile(`variables.scss`, fontDist, iconDist);
  copyFile(`style.css`, fontDist, iconDist);

  // Copy the index file
  copyFile(`index.html`, fontDist, iconDist, 'index.html');

  // Copy the README file
  copyFile('ICONS.txt', process.cwd(), iconDist, 'README.txt');
  copyFile('LICENSE', process.cwd(), iconDist);
  
  // Copy the package file
  copyFile('icons-package.json', process.cwd(), iconDist, 'package.json');
  const package = require(path.resolve(process.cwd(), 'package.json'));

  const distPackage = require(path.resolve(process.cwd(), 'icons-package.json'));
  distPackage.version = package.version;
  fs.writeFileSync(path.join(iconDist, 'package.json'), JSON.stringify(distPackage, null, 2));

  // Add in the aliasses to style.scss
  const aliases = require(path.resolve(process.cwd(), 'aliases.json'));
  Object.keys(aliases).forEach(key => {
    // console.log(key);
    aliases[key].forEach(alias => {
      console.log(`Alias: ${alias } for ${ key }`);
      fs.appendFileSync(path.join(iconDist, 'style.scss'), `.icon-${alias}:before { content: $icon-${key}; }\n`);
    })
  });

  // Delete the temp fonts dist
  deleteFolder(fontDist);

  console.log(`Version: ${ package.version }`);
}

main();