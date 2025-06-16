import { zodToCustomException } from '../src/shared/mappers/customException.mapper';
import { Logger } from '../src/shared/utils/logger';

jest.mock('../src/shared/utils/logger');

describe('zodToCustomException', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería mapear correctamente los errores de validación de Zod', () => {
        const mockZodError = {
            flatten: () => ({
                fieldErrors: {
                    name: ['El nombre es requerido'],
                    email: ['El email no es válido', 'El email es requerido'],
                    age: ['La edad debe ser mayor a 18']
                }
            })
        };

        const result = zodToCustomException(mockZodError);

        expect(result).toEqual([
            'El nombre es requerido',
            'El email no es válido',
            'El email es requerido',
            'La edad debe ser mayor a 18'
        ]);
    });

    it('debería retornar array vacío cuando no hay fieldErrors', () => {
        const mockZodError = {
            flatten: () => ({
                fieldErrors: {}
            })
        };

        const result = zodToCustomException(mockZodError);

        expect(result).toEqual([]);
    });

    it('debería manejar correctamente errores inesperados', () => {
        const mockZodError = {
            flatten: () => {
                throw new Error('Error inesperado');
            }
        };

        const result = zodToCustomException(mockZodError);

        expect(result).toEqual([]);
        expect(Logger.log).toHaveBeenCalledWith(
            'Error zodToCustomException',
            expect.any(Error)
        );
    });

    it('debería filtrar campos sin errores', () => {
        const mockZodError = {
            flatten: () => ({
                fieldErrors: {
                    name: ['El nombre es requerido'],
                    email: null,
                    age: undefined
                }
            })
        };

        const result = zodToCustomException(mockZodError);

        expect(result).toEqual(['El nombre es requerido']);
    });

    it('debería manejar correctamente arrays vacíos en fieldErrors', () => {
        const mockZodError = {
            flatten: () => ({
                fieldErrors: {
                    name: [],
                    email: ['El email es requerido']
                }
            })
        };

        const result = zodToCustomException(mockZodError);

        expect(result).toEqual(['El email es requerido']);
    });
});