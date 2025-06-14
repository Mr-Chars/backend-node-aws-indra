import { BaseBody } from '../dtos/baseBody';

export const baseBodyToApiResponse = (baseBody: BaseBody<any>, statusCode: number) =>{
    return {
        statusCode,
        body: JSON.stringify(baseBody)
    }
}