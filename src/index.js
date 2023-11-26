import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

@@ -29,6 +29,24 @@ function getNotebooks() {
}


function _checkAppPath(appPath) {
  // Check whether the appPath points to the current working directory.
  // This is only tolerated in the context of a GitHub actions workflow, but a warning is emitted.
  if ( path.resolve(appPath) == path.resolve(__dirname) ) {  // appPath points to current directory
    if ( process.env.GITHUB_ACTIONS == 'true' ) {
      core.warning(
        "The app-path is pointing to the current working directory! " +
        "Make sure to checkout the app before running this action.");
      return path.join(__dirname, 'app'); // point to empty directory
    } else {
      throw new Error("The app-path may not point to the current working directory.");
    }
  } else {
    return appPath;
  }
}


async function _create_docker_compose_file(context, aiidalabImage, jupyterToken, appPath, appName) {
  // We create the docker-compose on the fly to not need to package it.
  return composefile({
 @@ -128,10 +146,6 @@ async function run() {
      })
      .default('app-path', process.env.GITHUB_WORKSPACE || 'app/')
      .normalize('app-path') // normalize path
      .demandOption(
        'app-path',
        "Please set the app-path either directly with -a/-app-path=path/to/app " +
        "or via the $GITHUB_WORKSPACE environment variable.")
      .option('image', {
        description: 'The aiidalab image to test on.',
        alias: 'i',
 @@ -164,18 +178,7 @@ async function run() {
      })
      .default('notebooks', getNotebooks())
      .coerce(['app-path', 'screenshots'], path_ => path_ ? path.resolve(path_) : path_ )
      .coerce('app-path', (appPath) => {
        if ( path.resolve(appPath) == path.resolve(__dirname) ) {
          if ( process.env.GITHUB_ACTIONS == 'true' ) {
            core.warning(
              "The app-path is pointing to the current working directory! " +
              "Make sure to checkout the app before running this action.");
            return path.join(__dirname, 'app'); // point to empty directory
          } else {
            throw new Error("The app-path points to the current working directory.");
          }
        }
      })
      .coerce('app-path', _checkAppPath)
      .help()
      .argv;

    // Set some additional constants required for the docker-compose context.
    const projectName = process.env.AIIDALAB_TEST_WORKDIR || `aiidalabtests${ crypto.randomBytes(8).toString('hex') }`;
    const network = projectName + '_default';
    const jupyterToken = 'aiidalab-test'
    // Provide some context that could help during debugging.
    core.debug(`image: ${argv.image}`)
    core.debug(`app-path: ${argv.appPath}`)
    core.debug(`name: ${argv.name}`);
    core.debug(`screenshots: ${argv.screenshots}`)
    core.debug(`browser: ${argv.browser}`)
    core.debug(`bundled: ${argv.bundled}`)
    // Make screenshots directory if set
    if ( argv.screenshots ) {
      await io.mkdirP( argv.screenshots );
    }
    // Run tests...
    return startDockerCompose(projectName, argv.image, jupyterToken, argv.bundled ? "" : argv.appPath, argv.bundled ? "" : argv.name)
      .then(
        () => { return startSeleniumTests(network, jupyterToken, argv.appPath, argv.name, argv.browser, argv.notebooks, argv.screenshots, argv._); },
        err => { throw new Error("Unable to start docker-compose: " + err); })
      .then(
        () => { console.log("Completed selenium tests.")},
        err => { throw new Error("Failed to execute selenium tests: " + err); })
      .catch(err => { core.setFailed('Failed to execute selenium tests with error:\n' + err); })
      .then(() => { return cleanUp(projectName); })
  }
  catch (error) {
    core.setFailed(error.message);
  }
}
run()
