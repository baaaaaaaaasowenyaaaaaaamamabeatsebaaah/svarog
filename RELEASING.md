# Releasing Svarog UI

## 🚀 Quick Release

```bash
# 1. Check what changed
npx lerna changed

# 2. Version and publish
npm run publish:all
```

## 📋 Pre-Release Checklist

- [ ] All tests pass: `npm test`
- [ ] No lint errors: `npm run lint`
- [ ] Build succeeds: `npm run build:all`
- [ ] Changes committed: `git status`

## 📦 Version Guidelines

| Change Type      | Version Bump | Example           | Command                   |
| ---------------- | ------------ | ----------------- | ------------------------- |
| Bug fixes        | **Patch**    | `1.0.0` → `1.0.1` | `npx lerna version patch` |
| New features     | **Minor**    | `1.0.0` → `1.1.0` | `npx lerna version minor` |
| Breaking changes | **Major**    | `1.0.0` → `2.0.0` | `npx lerna version major` |

## 🔧 Common Scenarios

### Release a bug fix

```bash
git commit -m "fix: resolve button hover issue"
npx lerna version patch
npx lerna publish from-git
```

### Release a new feature

```bash
git commit -m "feat: add Tooltip component"
npx lerna version minor
npx lerna publish from-git
```

### Release a breaking change

```bash
git commit -m "BREAKING CHANGE: remove deprecated API"
npx lerna version major
npx lerna publish from-git
```

### Release a specific package only

```bash
npx lerna version patch --scope="@svarog-ui/theme-cabalou"
npx lerna publish from-git
```

## 🏷️ Prerelease Versions

### Beta release

```bash
npx lerna version prerelease --preid=beta
npx lerna publish from-git --dist-tag=beta
# Creates: 1.1.0-beta.0
```

### Alpha release

```bash
npx lerna version prerelease --preid=alpha
npx lerna publish from-git --dist-tag=alpha
# Creates: 1.1.0-alpha.0
```

## 🛠️ Useful Commands

```bash
# See what will be published
npx lerna changed

# Dry run (test release)
npx lerna publish --dry-run

# Force publish all packages
npx lerna publish --force-publish

# Skip all prompts
npx lerna publish --yes

# Publish without creating git tags
npx lerna publish --no-git-tag-version

# See dependency graph
npx lerna list --graph
```

## 🚨 Troubleshooting

### "Working tree has uncommitted changes"

```bash
# Commit your changes first
git add .
git commit -m "chore: prepare for release"
```

### "Package version already exists"

```bash
# Version was already bumped, just publish
npx lerna publish from-git
```

### "402 Payment Required" (scoped packages)

```bash
# Make scoped packages public
npm access public @svarog-ui/theme-default
```

### Failed publish (after versioning)

```bash
# Retry publishing already-versioned packages
npx lerna publish from-git
```

## 📝 After Release

1. **Update CHANGELOG.md** with release notes
2. **Create GitHub release** with tag
3. **Announce** major changes to users
4. **Monitor** npm downloads and issues

## 🔗 Quick Links

- [npm Registry](https://www.npmjs.com/search?q=svarog-ui)
- [Lerna Documentation](https://lerna.js.org/)
- [Semantic Versioning](https://semver.org/)

---

**Remember:** When in doubt, use `--dry-run` first!
