import { AppointmentClService } from "../src/application/services/appointmentCl.service";
import { Appointment } from "../src/domain/entities/appointment.entity";
import { CountriesEnum } from "../src/domain/enums/countries.enum";
import { StatusEnum } from "../src/domain/enums/status.enum";
import { EventBridgeService } from "../src/infrastructure/aws/eventbridge/eventbridge.service";
import { MysqlAppointmentClRepository } from "../src/infrastructure/mysql/appointmentCl.repository";

jest.mock('../src/infrastructure/mysql/appointmentCl.repository');
jest.mock('../src/infrastructure/aws/eventbridge/eventbridge.service');

describe('AppointmentClService', () => {
    let service: AppointmentClService;
    let mockAppointmentClRepository: jest.Mocked<MysqlAppointmentClRepository>;
    let mockEventBridgeService: jest.Mocked<EventBridgeService>;

    // Datos de prueba
    const validAppointment: Appointment = {
        id: 'e0305d9a-0266-4b4f-a37a-a2062f121ad7',
        insuredId: '11456',
        scheduleId: 7,
        countryISO: CountriesEnum.PE,
        status: StatusEnum.COMPLETED,
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-01T00:00:00Z')
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockAppointmentClRepository = new MysqlAppointmentClRepository() as jest.Mocked<MysqlAppointmentClRepository>;
        mockEventBridgeService = new EventBridgeService() as jest.Mocked<EventBridgeService>;

        service = new AppointmentClService();
        (service as any).appointmentClRepository = mockAppointmentClRepository;
        (service as any).eventBridgeService = mockEventBridgeService;
    });

    describe('create', () => {
        it('debería crear una cita correctamente con datos válidos', async () => {
            const result = await service.create(validAppointment);

            expect(result).toEqual(validAppointment);
        });
    });
});