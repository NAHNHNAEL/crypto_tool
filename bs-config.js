// bs-config.js
import browserSync from 'browser-sync';

const bs = browserSync.create();

bs.init({
  proxy: "localhost:3000",
  files: ["src/**/*.{html,css,js}"],
  port: 4000,
  reloadDelay: 1000
});

export default bs;