import { app } from './app.js';
import { AuthService } from './shared/services/auth.service.js';
import { ScheduleService } from './shared/services/schedule.service.js';
import { getPortFromUrl } from './shared/utils/url-port.js';
import { BACKEND_URL } from './config.js';

app.listen(getPortFromUrl(BACKEND_URL), async () => {
  await AuthService.ensureAdminExists();
  await ScheduleService.initializeScheduler();
  console.log(`Server running at ${BACKEND_URL}`);
});
