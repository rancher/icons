#!/bin/bash
set -e

UPLOAD=upload
REPO=$(git config --get remote.origin.url)
DIR=$(cd $(dirname $0); pwd)

echo "Upload new icons dist to the git repository"
echo ${DIR}
echo ${REPO}

FORCE=false
INPLACE=false

while getopts fi flag
do
    case "${flag}" in
        f) FORCE=true;;
        i) INPLACE=true;;
    esac
done

VERSION=$(node -pe "require('./package.json').version")
COMMIT=$(git rev-parse --short HEAD)
echo ${VERSION}
echo ${COMMIT}

if [ ! -z "$(git status --porcelain)" ]; then 
  echo "Working directory is not clean - commit changes before uploading font"
  if [ "$FORCE" == "false" ]; then
    exit 1
  fi
fi

# Check the a branch for this version of the buit icon font does not exist already
INFO=$(git ls-remote --heads ${REPO} v${VERSION})
if [ -n "${INFO}" ]; then
  echo "A branch named v${VERSION} already exists in the icons repository - can't change an already published version"
  echo "Update the version in the package.json file"
  if [ "$FORCE" == "false" ]; then
    exit 1
  fi
fi

echo "Building font ..."
npm run build

DIST=${DIR}/dist/icons/

if [ ${INPLACE} == 'true' ]; then
  echo "Updating in-place with checked out repository"
  TEMPDIR=$(mktemp -d)
  cp -R ${DIST} ${TEMPDIR}
  DIST=${TEMPDIR}/
  pushd .
else
  echo "Cloning icon repository"
  rm -rf ${UPLOAD}
  mkdir ${UPLOAD}
  git clone ${REPO} ${UPLOAD}
  pushd ${UPLOAD}
fi

# Update the dist branch - this is the latest build of the icon font
git checkout -B dist
rm -rf *
cp -R ${DIST} .
git add -A
git commit -m "Rancher Icons updated for version ${VERSION}, commit ${COMMIT}"
git push origin dist --force

# Create a branch named v{VERSION} and push that
git checkout -B v${VERSION}
git push origin v${VERSION}

popd

echo "All done"
