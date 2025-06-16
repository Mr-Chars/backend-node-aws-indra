import { CreateAppointmentDto } from "../appointment/application/dtos/createAppointment.dto";
import { GetAppointmentResponseDto } from "../appointment/application/dtos/getAppointment.dto";

export interface AppointmentRequest {
  insuredId: string,
  scheduleId: number,
  countryISO: "PE" | "CL"
};

export interface AppointmentResponse {
  success: true,
  data: {
    id: string,
    insuredId: string,
    scheduleId: number,
    countryISO: "PE" | "CL",
    status: "PENDING" | "COMPLETED",
    createdAt: string,
    updatedAt: string,
  }
}

export interface AppointmentListResponse {
  success: boolean;
  data: {
    id: string,
    insuredId: string,
    scheduleId: number,
    countryISO: "PE" | "CL",
    status: "PENDING" | "COMPLETED",
    createdAt: string,
    updatedAt: string,
  }[]
}