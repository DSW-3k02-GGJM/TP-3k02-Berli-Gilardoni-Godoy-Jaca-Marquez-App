// MikroORM
import { orm } from '../database/orm.js';

// Entities
import { Reminder } from '../../core/reminder/reminder.entity.js';

// Services
import { MailService } from './mail.service.js';

// External Libraries
import cron from 'node-cron';
import { format, addHours } from 'date-fns';

const em = orm.em.fork();

export class ScheduleService {
  static async sendPendingReminders() {
    console.log('\nChecking pending reminders...');
    const reminders = await em.find(
      Reminder,
      {
        sent: false,
        reminderDate: { $lte: new Date() },
      },
      {
        populate: [
          'reservation.user',
          'reservation.vehicle.vehicleModel',
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
      const adjustedStartDate = addHours(new Date(startDate), 3);
      const formattedStartDate = format(
        new Date(adjustedStartDate),
        'dd/MM/yyyy'
      );

      const realEndDate = reminder.reservation.realEndDate;
      const cancellationDate = reminder.reservation.cancellationDate;

      if (realEndDate || cancellationDate) {
        console.log(
          `\nReminder skipped: reservation ${reminder.reservation.id} has ended or been cancelled.`
        );
        continue;
      }

      const now = new Date();
      if (now < new Date(startDate)) {
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
          `Reminder skipped: reservation ${reminder.reservation.id} has already started.`
        );
      }
    }

    console.log(`Reminders sent: ${remindersSent}`);
  }

  static async initializeScheduler() {
    console.log('Scheduler initialized:\n - Frequency (Every 10 minutes)\n');
    cron.schedule('*/10 * * * *', async () => {
      try {
        await ScheduleService.sendPendingReminders();
      } catch (error) {
        console.error('Error processing pending reminders:', error);
      }
    });
  }
}
