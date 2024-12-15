import cron from 'node-cron';
import { format, subDays, addHours } from 'date-fns';
import { MailService } from './mail.service.js';
import { orm } from './orm.js';
import { Reservation } from '../../reservation/reservation.entity.js';
import { User } from '../../user/user.entity.js';

const em = orm.em.fork();

export class ScheduleService {
    static reservationReminder = async (email: string, date: string) => {
        const parsedDate = new Date(date);
        const remiderDate = subDays(parsedDate, 1);
        const reminderDay = format(remiderDate, 'd');
        const todayDay = format(new Date(), 'd');
        const formattedDate = format(parsedDate, 'dd/MM/yyyy');
        if (reminderDay > todayDay) {
            const cronDate = ScheduleService.convertToCronFormat(remiderDate);
            console.log(`Scheduling reminder for ${email} at ${cronDate}`);
            cron.schedule(cronDate, async () => {
                console.log(`Sending reminder to ${email}`);
                await MailService.sendMail(
                        [email],
                        'Recordatorio de reserva',
                        `Este es un recordatorio de que tienes una reserva por comenzar. Recuerda que la fecha de inicio es ${formattedDate}. \n\n¡Que disfrutes tu viaje! \nAlquilcar Rerservas`,
                        ''
                    );
            });
        }
        
    }

    static convertToCronFormat(parsedDate: Date): string {
        const day = format(parsedDate, 'd');
        const month = format(parsedDate, 'M');
        const cronFormat = `1 0 ${day} ${month} *`; // Ejecutar a medianoche del día y mes especificados
        return cronFormat;
      }

    static startReminders = async () => {
        const qb = em.createQueryBuilder(Reservation, 'r');
        qb.where({ 
            realEndDate: null, // No terminadas
            cancellationDate: null // No canceladas
        });
        const activeReservations = await qb.getResultList();
        activeReservations.forEach(async (reservation) => {
            const user = await em.findOneOrFail(User, { id: reservation.user.id });
            const adjustedDate = addHours(reservation.startDate.toISOString(), 3);
            this.reservationReminder(user.email, adjustedDate.toISOString());
        });
    }
}
