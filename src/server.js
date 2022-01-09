import App from './app.js';
import { initializeDatabase } from './libs/database';
import UserComponent from './api/user/component';
import UploadComponent from './api/upload/component.js';
async function start() {
  await initializeDatabase('WASHSWAT');
  const app = new App([
    new UserComponent(),
    new UploadComponent(),
  ]);
  app.listen();
}
start();
