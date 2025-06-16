import { Logger } from '../src/shared/utils/logger';

const mockConsole = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn()
};

global.console = mockConsole as any;

describe('Logger', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers().setSystemTime(new Date('2023-01-01T00:00:00Z'));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    describe('log', () => {
        it('debería registrar mensajes con timestamp', () => {
            const message = 'Test log message';
            const extraData = { key: 'value' };

            Logger.log(message, extraData);

            expect(console.log).toHaveBeenCalledWith(
                '[2023-01-01T00:00:00.000Z] Test log message',
                extraData
            );
        });
    });

    describe('error', () => {
        it('debería registrar errores con prefijo ERROR', () => {
            const errorMessage = 'Test error message';
            const error = new Error('Something went wrong');

            Logger.error(errorMessage, error);

            expect(console.error).toHaveBeenCalledWith(
                '[2023-01-01T00:00:00.000Z] ERROR: Test error message',
                error
            );
        });
    });

    describe('warn', () => {
        it('debería registrar advertencias con prefijo WARN', () => {
            const warningMessage = 'Test warning message';
            const extraInfo = { reason: 'sample reason' };

            Logger.warn(warningMessage, extraInfo);

            expect(console.warn).toHaveBeenCalledWith(
                '[2023-01-01T00:00:00.000Z] WARN: Test warning message',
                extraInfo
            );
        });
    });

    describe('info', () => {
        it('debería registrar información con prefijo INFO', () => {
            const infoMessage = 'Test info message';
            const metadata = { userId: 123 };

            Logger.info(infoMessage, metadata);

            expect(console.info).toHaveBeenCalledWith(
                '[2023-01-01T00:00:00.000Z] INFO: Test info message',
                metadata
            );
        });
    });

    describe('comportamiento general', () => {
        it('debería manejar mensajes sin argumentos adicionales', () => {
            Logger.log('Simple message');
            expect(console.log).toHaveBeenCalledWith(
                '[2023-01-01T00:00:00.000Z] Simple message'
            );
        });

        it('debería manejar múltiples argumentos', () => {
            Logger.error('Error', 'details', 500, { stack: 'trace' });
            expect(console.error).toHaveBeenCalledWith(
                '[2023-01-01T00:00:00.000Z] ERROR: Error',
                'details',
                500,
                { stack: 'trace' }
            );
        });
    });
});