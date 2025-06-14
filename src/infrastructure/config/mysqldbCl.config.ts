import mysql from 'mysql2/promise';
import { CustomException } from '../../shared/exceptions/custom.exception';
import { HTTP_STATUS_CODE } from '../../shared/utils/constants';

const configDBCl = {
    host: process.env.DB_HOST_CL,
    user: process.env.DB_USERNAME_CL,
    password: process.env.DB_PASSWORD_CL,
    database: process.env.DB_NAME_CL,
    port: Number(process.env.DB_PORT_CL),

};


const getConnectionMysqlCl = async () => {
    try {
        const connection = await mysql.createConnection(configDBCl);
        return connection;
    } catch (error: any) {
        throw new CustomException(`Error al conectar Mysql`, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
}

export default getConnectionMysqlCl;