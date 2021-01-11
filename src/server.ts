import app from './app';

const server = app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.info(`🌍 Listening on port ${app.get('port')}`);
});

export default server;
