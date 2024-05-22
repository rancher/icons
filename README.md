Rancher Icons
=============

> Icons for the legacy Ember UI are in the `ember` branch of this repository.

Icons used by the Rancher Dashboard UI.

You can preview the icons available here: https://rancher.github.io/icons/

To build the icon font locally, run the following commands:

- yarn install
- yarn build

The font files are generated in the 'dist' folder.

You can open the file `index.html` in the dist folder to view the available icons.

# Updating the Icon Font

1. Add any new SVGs to the `svg/` folder
1. Update the version number in `package.json`
1. Update `CHANGELOG.md` to include the new version number and detail icons added/removed
1. Commit the changes to this repository

Once merged into the `master` branch, the GitHub Action will automatically build the icon font and publish it to NPM.

# Developing locally

You may want to add icons to the icon set and validate things are working correctly before publishng a new icon font.

You can to this by checking out the Rancher Dashboard UI, building the icon font using `yarn build` and then use `yarn copy [PATH]` where `[PATH]` is the path to your local
checkout of the Dashbord repository. The `copy` script will copy the built font into the `node_modules/rancher-icons` folder of Dashboard.
