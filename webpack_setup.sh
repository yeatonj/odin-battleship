# initialze npm
npm init -y
# initialize webpack
npm install --save-dev webpack webpack-cli
# html webpack
npm install --save-dev html-webpack-plugin
# css loader
npm install --save-dev style-loader css-loader
# load images correctly
npm install --save-dev html-loader
# dev server
npm install --save-dev webpack-dev-server
# merging config files
npm install --save-dev webpack-merge
## add the following to package.json scripts section ----------------------
    # "dev": "webpack serve --config webpack.dev.js",
    # "build": "webpack --config webpack.prod.js",
    # "deploy": "git subtree push --prefix dist origin gh-pages"
## -----------------------------------------------------------------
# run server
# npm run build/dev/deploy (from scripts in package.json)
# access dev at http://localhost:8080

# Deployment--------
# create branch ------
# git branch gh-pages
# commit all work and merge from main to gh-pages-------
# npm run deploy

# finish deployment with below ----------
# git add dist -f && git commit -m "Deployment commit"
# git subtree push --prefix dist origin gh-pages
# git checkout main
