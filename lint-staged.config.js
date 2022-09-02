module.exports = {
  '**/*.{ts,js,json}': ['prettier --write'],
  '**/*.{ts,js}': ['eslint --max-warnings 0 --fix'],
};
