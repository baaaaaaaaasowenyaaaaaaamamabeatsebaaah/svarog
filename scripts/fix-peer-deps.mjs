import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const corePackage = JSON.parse(
  readFileSync('packages/svarog-ui-core/package.json', 'utf8')
);
const coreVersion = corePackage.version;
const majorVersion = parseInt(coreVersion.split('.')[0]);

console.log(`🔧 Fixing peer dependencies for svarog-ui-core@${coreVersion}`);

// Update all theme packages peer dependencies
const themePackages = glob.sync('packages/@svarog-ui/*/package.json');

themePackages.forEach((pkgPath) => {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

  if (pkg.peerDependencies && pkg.peerDependencies['svarog-ui-core']) {
    const newRange = `>=${coreVersion} <${majorVersion + 1}.0.0`;
    pkg.peerDependencies['svarog-ui-core'] = newRange;

    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
    console.log(`✅ Updated ${pkg.name}: svarog-ui-core@${newRange}`);
  }
});

// Update main svarog-ui package
const mainPackage = JSON.parse(
  readFileSync('packages/svarog-ui/package.json', 'utf8')
);
if (mainPackage.dependencies && mainPackage.dependencies['svarog-ui-core']) {
  const newRange = `>=${coreVersion} <${majorVersion + 1}.0.0`;
  mainPackage.dependencies['svarog-ui-core'] = newRange;

  // Also update theme dependency to be compatible
  if (mainPackage.dependencies['@svarog-ui/theme-default']) {
    const themePackage = JSON.parse(
      readFileSync('packages/@svarog-ui/theme-default/package.json', 'utf8')
    );
    const themeVersion = themePackage.version;
    const themeMajor = parseInt(themeVersion.split('.')[0]);
    mainPackage.dependencies['@svarog-ui/theme-default'] =
      `>=${themeVersion} <${themeMajor + 1}.0.0`;
  }

  writeFileSync(
    'packages/svarog-ui/package.json',
    `${JSON.stringify(mainPackage, null, 2)}\n`
  );
  console.log(`✅ Updated svarog-ui main package dependencies`);
}

console.log('🎉 All peer dependencies fixed!');
