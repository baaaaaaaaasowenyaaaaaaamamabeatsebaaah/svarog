#!/bin/sh

# Set up husky
npx husky install

# Create simple pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh

# Run tests only
npm test
EOF

# Make hook executable
chmod +x .husky/pre-commit

echo "Husky setup completed"