Rancher Icons
=============

> Icons for the legacy Ember UI are in the `ember` branch of this repository.

Icons used by the Rancher Dashboard UI.

To build the icon font:

- yarn install
- npm run build

The font files are generated in the 'dist' folder.

You can open the file `demo.html` in the dist folder to view the available icons.

# Updating the Icon Font

1. Add any new SVGs to the `svg` folder
1. Update the version number in `package.json`
1. Commit the changes to this repository
1. Build and upload the font by running `yarn run upload`
