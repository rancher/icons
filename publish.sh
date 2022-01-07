#!/bin/bash
set -e

UPLOAD=upload
REPO=git@github.com:rancher/icons.git
DIR=$(cd $(dirname $0); pwd)
echo ${DIR}

echo "Upload new icons dist to the git repository"

VERSION=$(node -pe "require('./package.json').version")
COMMIT=$(git rev-parse --short HEAD)
echo ${VERSION}
echo ${COMMIT}

if [ ! -z "$(git status --porcelain)" ]; then 
  echo "Working directory is not clean - commit changes before uploading font"
  #exit 1
fi

# Check the a branch for this version of the buit icon font does not exist already
INFO=$(git ls-remote --heads ${REPO} v${VERSION})
if [ -n "${INFO}" ]; then
  echo "A branch named v${VERSION} already exists in the icons repository - can't change an already published version"
  echo "Update the version in the package.json file"
  #exit 1
fi

echo "Building font ..."
npm run build

echo "Cloning icon repository"
rm -rf ${UPLOAD}
mkdir ${UPLOAD}
git clone ${REPO} ${UPLOAD}
cd ${UPLOAD}
# Update the dist branch - this is the latest build of the icon font
git checkout dist
rm -rf *
cp -R ${DIR}/dist/icons/ .
git add -A
git commit -m "Rancher Icons updated for version ${VERSION}, commit ${COMMIT}"
git push origin dist

# Create a branch named v{VERSION} and push that
git checkout -b v${VERSION}
git push origin v${VERSION}

cd ..

echo "All done"
