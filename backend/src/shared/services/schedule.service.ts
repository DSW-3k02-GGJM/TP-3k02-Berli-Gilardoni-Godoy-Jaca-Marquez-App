// MikroORM
import { orm } from '../database/orm.js';

// Entities
import { Reminder } from '../../core/reminder/reminder.entity.js';

// Services
import { MailService } from './mail.service.js';

// Utils
import { fromDashToSlash, formatDateToDash } from '../utils/format-date.js';

// External Libraries
import cron from 'node-cron';

const em = orm.em.fork();

export class ScheduleService {
  static async sendPendingReminders() {
    console.log('\nChecking pending reminders...');
    const currentDate = formatDateToDash(new Date());
    const reminders = await em.find(
      Reminder,
      {
        sent: false,
        reminderDate: { $lte: currentDate },
      },
      {
        populate: [
          'reservation.user',
          'reservation.vehicle.vehicleModel.brand',
        ],
      }
    );

    if (reminders.length === 0) {
      console.log('\nNo pending reminders to send');
      return;
    }

    let remindersSent = 0;

    for (const reminder of reminders) {
      const email = reminder.reservation.user.email;
      const startDate = reminder.reservation.startDate;

      const realEndDate = reminder.reservation.realEndDate;
      const cancellationDate = reminder.reservation.cancellationDate;

      if (realEndDate || cancellationDate) {
        console.log(
          `\nReminder skipped: reservation ${reminder.reservation.id} has ended or been cancelled.`
        );
        continue;
      }

      if (currentDate < startDate) {
        const formattedStartDate = fromDashToSlash(startDate);
        const brand = reminder.reservation.vehicle.vehicleModel.brand.brandName;
        const vehicleModel =
          reminder.reservation.vehicle.vehicleModel.vehicleModelName;

        await MailService.sendMail(
          [email],
          '¡Tus llaves te esperan! Descubre Rosario con nosotros',
          '',
          `
          <p>¡Tu aventura comienza <strong>mañana</strong>!</p>
          <p>El <strong>${formattedStartDate}</strong>, tu <strong>${brand} ${vehicleModel}</strong> te estará esperando para que explores la ciudad con total libertad.</p>
          <p>Solo falta un día para que comience tu reserva. ¡Preparate para disfrutar de un viaje cómodo y seguro!</p>
          <p><strong>Alquilcar Reservas</strong></p>
          `
        );

        reminder.sent = true;
        await em.flush();

        remindersSent++;
      } else {
        console.log(
          `\nReminder skipped: reservation ${reminder.reservation.id} has already started.`
        );
      }
    }

    console.log(`\nReminders sent: ${remindersSent}`);
  }

  static async initializeScheduler() {
    console.log('Scheduler initialized:\n - Frequency (Every minute)\n');
    cron.schedule('* * * * *', async () => {
      try {
        await ScheduleService.sendPendingReminders();
      } catch (error) {
        console.error('Error processing pending reminders:', error);
      }
    });
  }
}
