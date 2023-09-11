module.exports = {
  '**/*.{ts,js,json,md,yml}': ['prettier --write'],
  '**/*.{ts,js}': ['eslint --max-warnings 0 --fix'],
};
