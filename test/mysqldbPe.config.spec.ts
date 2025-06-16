import getConnectionMysqlPe from '../src/infrastructure/config/mysqldbPe.config';
import mysql from 'mysql2/promise';
import { CustomException } from '../src/shared/exceptions/custom.exception';
import { HTTP_STATUS_CODE } from '../src/shared/utils/constants';

jest.mock('mysql2/promise');

describe('getConnectionMysqlPe', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            DB_HOST_PE: 'localhost',
            DB_USERNAME_PE: 'user',
            DB_PASSWORD_PE: 'password',
            DB_NAME_PE: 'database',
            DB_PORT_PE: '3306'
        };
        jest.clearAllMocks();
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('debería crear una conexión con la configuración correcta', async () => {
        const mockConnection = {
            end: jest.fn()
        };
        (mysql.createConnection as jest.Mock).mockResolvedValue(mockConnection);

        const connection = await getConnectionMysqlPe();
        expect(connection).toBe(mockConnection);
    });

    it('debería lanzar CustomException cuando falla la conexión', async () => {
        const mockError = new Error('Connection error');
        (mysql.createConnection as jest.Mock).mockRejectedValue(mockError);

        await expect(getConnectionMysqlPe())
            .rejects.toThrow(CustomException);

        await expect(getConnectionMysqlPe())
            .rejects.toMatchObject({
                message: 'Error al conectar Mysql',
                statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
            });
    });
});