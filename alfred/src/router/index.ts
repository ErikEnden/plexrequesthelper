import authController from './controllers/authController';
import requestController from './controllers/requestController';

export default function initializeRouter(app: any) {
  app.use('/api/auth', authController);
  app.use('/api/requests', requestController);
}
