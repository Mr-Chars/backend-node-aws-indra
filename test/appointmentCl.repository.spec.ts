import { MysqlAppointmentClRepository } from '../src/infrastructure/mysql/appointmentCl.repository';
import { CustomException } from '../src/shared/exceptions/custom.exception';
import { HTTP_STATUS_CODE } from '../src/shared/utils/constants';
import { Appointment } from '../src/domain/entities/appointment.entity';
import getConnectionMysqlCl from '../src/infrastructure/config/mysqldbCl.config';
import { CountriesEnum } from '../src/domain/enums/countries.enum';
import { StatusEnum } from '../src/domain/enums/status.enum';

jest.mock('../src/infrastructure/config/mysqldbCl.config');

describe('MysqlAppointmentClRepository', () => {
    let repository: MysqlAppointmentClRepository;
    let mockConnection: any;

    const mockAppointment: Appointment = {
        id: 'apt-123',
        insuredId: 'insured-123',
        scheduleId: 3,
        countryISO: CountriesEnum.CL,
        status: StatusEnum.COMPLETED,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockConnection = {
            execute: jest.fn(),
            end: jest.fn()
        };

        (getConnectionMysqlCl as jest.Mock).mockResolvedValue(mockConnection);

        repository = new MysqlAppointmentClRepository();
    });

    describe('createAppointment', () => {
        it('debería crear una cita correctamente', async () => {
            await expect(repository.createAppointment(mockAppointment)).resolves.not.toThrow();

            expect(getConnectionMysqlCl).toHaveBeenCalled();

            expect(mockConnection.execute).toHaveBeenCalledWith(
                `INSERT INTO appointments (id, insuredId, scheduleId, countryISO, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    'apt-123',
                    'insured-123',
                    3,
                    'CL',
                    'COMPLETED',
                    '2023-01-01 10:00:00',
                    '2023-01-01 10:00:00'
                ]
            );
            expect(mockConnection.end).toHaveBeenCalled();
        });

        it('debería lanzar CustomException cuando falla la inserción', async () => {
            const dbError = new Error('Error de base de datos');
            mockConnection.execute.mockRejectedValue(dbError);

            await expect(repository.createAppointment(mockAppointment))
                .rejects.toThrow(CustomException);

            await expect(repository.createAppointment(mockAppointment))
                .rejects.toMatchObject({
                    message: 'Error insertar appointment',
                    statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
                });

            expect(mockConnection.end).toHaveBeenCalled();
        });
    });
});