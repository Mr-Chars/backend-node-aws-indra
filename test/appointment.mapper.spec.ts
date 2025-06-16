import { AppointmentMapper } from '../src/application/mappers/appointment.mapper';
import { CreateAppointmentDto } from '../src/application/dtos/createAppointment.dto';
import { GetAppointmentResponseDto } from '../src/application/dtos/getAppointment.dto';
import { Appointment } from '../src/domain/entities/appointment.entity';
import { StatusEnum } from '../src/domain/enums/status.enum';
import { v4 } from 'uuid';
import { CountriesEnum } from '../src/domain/enums/countries.enum';

jest.mock('uuid', () => ({
    v4: jest.fn()
}));

describe('AppointmentMapper', () => {
    const mockUuid = 'mocked-uuid-1234';
    const mockDate = new Date('2023-01-01T00:00:00Z');

    beforeAll(() => {
        (v4 as jest.Mock).mockReturnValue(mockUuid);
        jest.useFakeTimers().setSystemTime(mockDate);
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    describe('toDomain', () => {
        it('should convert CreateAppointmentDto to Appointment domain model', () => {
            // Datos de prueba
            const createDto: CreateAppointmentDto = {
                insuredId: 'insured-123',
                scheduleId: 5,
                countryISO: CountriesEnum.CL
            };

            // Ejecutar el método
            const result = AppointmentMapper.toDomain(createDto);

            // Verificaciones
            expect(result).toBeInstanceOf(Appointment);
            expect(result.id).toBe(mockUuid);
            expect(result.insuredId).toBe(createDto.insuredId);
            expect(result.scheduleId).toBe(createDto.scheduleId);
            expect(result.countryISO).toBe(createDto.countryISO);
            expect(result.status).toBe(StatusEnum.PENDING);
            expect(result.createdAt).toEqual(mockDate);
            expect(result.updatedAt).toEqual(mockDate);
        });
    });

    describe('entityToDto', () => {
        it('should convert Appointment entity to GetAppointmentResponseDto', () => {
            // Datos de prueba
            const appointmentEntity = new Appointment({
                id: 'appointment-789',
                insuredId: 'insured-123',
                scheduleId: 1,
                countryISO: CountriesEnum.CL,
                status: StatusEnum.COMPLETED,
                createdAt: new Date('2023-01-01T00:00:00Z'),
                updatedAt: new Date('2023-01-02T00:00:00Z')
            });

            // Ejecutar el método
            const result = AppointmentMapper.entityToDto(appointmentEntity);

            // Verificaciones
            expect(result).toEqual({
                id: 'appointment-789',
                insuredId: 'insured-123',
                scheduleId: 1,
                countryISO: CountriesEnum.CL,
                status: StatusEnum.COMPLETED,
                createdAt: new Date('2023-01-01T00:00:00Z'),
                updatedAt: new Date('2023-01-02T00:00:00Z')
            } as GetAppointmentResponseDto);
        });
    });
});