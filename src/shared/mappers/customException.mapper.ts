import { Logger } from "../utils/logger";

export const zodToCustomException = (error: any) => {
    try {
        const fieldErrors = error.flatten().fieldErrors;
        const errorMessages: string[] = [];

        for (const key in fieldErrors) {
            if (fieldErrors[key]) {
                errorMessages.push(...fieldErrors[key]!);
            }
        }

        return errorMessages;
    } catch (error) {
        Logger.log('Error zodToCustomException', error);
        return [];
    }

}