import { AppointmentPeService } from "../src/application/services/appointmentPe.service";
import { Appointment } from "../src/domain/entities/appointment.entity";
import { CountriesEnum } from "../src/domain/enums/countries.enum";
import { StatusEnum } from "../src/domain/enums/status.enum";
import { EventBridgeService } from "../src/infrastructure/aws/eventbridge/eventbridge.service";
import { MysqlAppointmentPeRepository } from "../src/infrastructure/mysql/appointmentPe.repository";

jest.mock('../src/infrastructure/mysql/appointmentPe.repository');
jest.mock('../src/infrastructure/aws/eventbridge/eventbridge.service');

describe('AppointmentPeService', () => {
    let service: AppointmentPeService;
    let mockAppointmentPeRepository: jest.Mocked<MysqlAppointmentPeRepository>;
    let mockEventBridgeService: jest.Mocked<EventBridgeService>;

    // Datos de prueba
    const validAppointment: Appointment = {
        id: '3c611c09-4380-4703-82d9-631dd495d132',
        insuredId: '45116',
        scheduleId: 7,
        countryISO: CountriesEnum.PE,
        status: StatusEnum.COMPLETED,
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-01T00:00:00Z')
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockAppointmentPeRepository = new MysqlAppointmentPeRepository() as jest.Mocked<MysqlAppointmentPeRepository>;
        mockEventBridgeService = new EventBridgeService() as jest.Mocked<EventBridgeService>;

        service = new AppointmentPeService();
        (service as any).appointmentPeRepository = mockAppointmentPeRepository;
        (service as any).eventBridgeService = mockEventBridgeService;
    });

    describe('create', () => {
        it('debería crear una cita correctamente con datos válidos', async () => {
            const result = await service.create(validAppointment);

            expect(result).toEqual(validAppointment);
        });
    });
});