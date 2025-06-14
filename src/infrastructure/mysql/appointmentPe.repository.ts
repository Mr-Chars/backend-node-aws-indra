import { CustomException } from "../../shared/exceptions/custom.exception";
import { HTTP_STATUS_CODE } from "../../shared/utils/constants";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentMysqlPeRepository } from "../../domain/repositories/appointmentMysqlPe.repository";
import getConnectionMysqlPe from "../config/mysqldbPe.config";

export class MysqlAppointmentPeRepository implements AppointmentMysqlPeRepository {

    async createAppointment(appointment: Appointment): Promise<void> {
        let connection;
        try {
            const formatDateToMySQL = (date: Date): string =>
                date.toISOString().slice(0, 19).replace('T', ' ');

            const query = `INSERT INTO appointments (id, insuredId, scheduleId, countryISO, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const values = [
                appointment.id,
                appointment.insuredId,
                appointment.scheduleId,
                appointment.countryISO,
                appointment.status,
                formatDateToMySQL(appointment.createdAt),
                formatDateToMySQL(appointment.updatedAt)
            ];
            connection = await getConnectionMysqlPe();
            await connection.execute(query, values);
        } catch (error: any) {
            throw new CustomException(`Error insertar appointment`, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
        } finally {
            if (connection) {
                connection.end();
            }
        }
    }
}
