module.exports = () => {
  process.on('uncaughtException', (err) => {
    console.error('uncaughtException:\n', err);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    console.error('unhandledRejection:\n', err);
    process.exit(1);
  });
};
