const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const childProcess = require('child_process');

const ignoredDependencies = ['material-ui', 'graphql'];
getDependencies().then(dependencies => upgrade(dependencies))
  .then(dependencies => compareDependencies(dependencies)).catch(err => console.log(err));

function getDependencies() {
  return fs.readFileAsync('./package.json').then((data) => {
    const packageJSON = JSON.parse(data);

    return Object.entries(packageJSON.dependencies)
      .concat(Object.entries(packageJSON.devDependencies))
      .filter(entry => ignoredDependencies.indexOf(entry[0]) === -1);
  });
}

function upgrade(dependencies) {
  return new Promise((resolve) => {
    console.log();

    const dependencyNames = dependencies.map(value => `${value[0]}@latest`);

    console.log(`Upgrading dependencies:\n${dependencyNames.join(', ')}\n`);
    console.log();

    const upgradeProcess = childProcess.spawn(
      /^win/.test(process.platform) ? 'yarn.cmd' : 'yarn',
      ['upgrade'].concat(dependencyNames)
    )
      .on('exit', () => {
        resolve(dependencies);
      });
    upgradeProcess.stdout.pipe(process.stdout);
  });
}

function compareDependencies(oldDependencies) {
  getDependencies().then((newDependencies) => {
    console.log();
    console.log('Upgraded dependencies:');

    const newObject = {};
    for (let i = 0; i < newDependencies.length; i++) {
      newObject[newDependencies[i][0]] = newDependencies[i][1];
    }

    let isUpdated = false;
    oldDependencies.forEach((entry) => {
      if (entry[1] !== newObject[entry[0]]) {
        console.log(`  ${entry[0]}: ${entry[1]} -> ${newObject[entry[0]]}`);
        isUpdated = true;
      }
    });

    if (isUpdated !== true) {
      console.log('none');
    }
  }).catch(err => console.log(err));
}
