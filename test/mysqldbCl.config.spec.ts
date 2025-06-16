import getConnectionMysqlCl from '../src/infrastructure/config/mysqldbCl.config';
import mysql from 'mysql2/promise';
import { CustomException } from '../src/shared/exceptions/custom.exception';
import { HTTP_STATUS_CODE } from '../src/shared/utils/constants';

jest.mock('mysql2/promise');

describe('getConnectionMysqlCl', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            DB_HOST_CL: 'localhost',
            DB_USERNAME_CL: 'user',
            DB_PASSWORD_CL: 'password',
            DB_NAME_CL: 'database',
            DB_PORT_CL: '3306'
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

        const connection = await getConnectionMysqlCl();
        expect(connection).toBe(mockConnection);
    });

    it('debería lanzar CustomException cuando falla la conexión', async () => {
        const mockError = new Error('Connection error');
        (mysql.createConnection as jest.Mock).mockRejectedValue(mockError);

        await expect(getConnectionMysqlCl())
            .rejects.toThrow(CustomException);

        await expect(getConnectionMysqlCl())
            .rejects.toMatchObject({
                message: 'Error al conectar Mysql',
                statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
            });
    });
});