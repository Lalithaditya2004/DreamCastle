import axios from 'axios';
import { Owner, PG, Room, Guest, Warden, Worker } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Owner API
export const ownerAPI = {
  create: (data: Omit<Owner, 'UserID'>) => api.post('/owners/create', data),
  getByPG: (pgId: number) => api.get(`/owners/view/${pgId}`),
  update: (userId: number, data: Omit<Owner, 'UserID'>) => api.put(`/owners/update/${userId}`, data),
};

// PG API
export const pgAPI = {
  create: (data: Omit<PG, 'PGId'>) => api.post('/pgs/create', data),
  getByOwner: (ownerId: number) => api.get(`/pgs/owner/${ownerId}`),
  delete: (pgId: number) => api.delete(`/pgs/delete/${pgId}`),
  updateDetails: (pgId: number, data: Partial<PG>) => api.put(`/pgs/update/${pgId}`, data),
  updateRevenue: (pgId: number, revenue: number) => api.put(`/pgs/update-revenue/${pgId}`, { Revenue: revenue }),
  updateWarden: (pgId: number, wardenId: number) => api.put(`/pgs/update-warden/${pgId}`, { WardenID: wardenId }),
};

// Room API
export const roomAPI = {
  create: (data: Omit<Room, 'RoomId' | 'Vacancies'>) => api.post('/rooms/create', data),
  getByPG: (pgId: number) => api.get(`/rooms/pg/${pgId}`),
  getByFloor: (pgId: number, floorNo: number) => api.get(`/rooms/pg/${pgId}/floor/${floorNo}`),
  getByRoomNo: (pgId: number, roomNo: string) => api.get(`/rooms/pg/${pgId}/roomno/${roomNo}`),
  getVacancies: (pgId: number, params?: { floor?: number; date?: string; beds?: number; status?: string }) => 
    api.get(`/rooms/pg/${pgId}/vacancies`, { params }),
  getCleaningStatus: (pgId: number, floorNo: number) => api.get(`/rooms/pg/${pgId}/floor/${floorNo}/cleaning-status`),
};

// Guest API
export const guestAPI = {
  create: (data: Guest) => api.post('/guests/create', data),
  getByPG: (pgId: number) => api.get(`/guests/pg/${pgId}`),
  getByRoom: (pgId: number, roomNumber: string) => api.get(`/guests/pg/${pgId}/room/${roomNumber}`),
  getByFloor: (pgId: number, floorNumber: number) => api.get(`/guests/pg/${pgId}/floor/${floorNumber}`),
  delete: (aadharId: number) => api.delete(`/guests/delete/${aadharId}`),
  updateFeeStatus: (aadharId: number, feeStatus: string) => api.put(`/guests/update-fee-status/${aadharId}`, { Fee_status: feeStatus }),
  updateDOL: (aadharId: number, dol: string) => api.put(`/guests/update-dol/${aadharId}`, { DOL: dol }),
  updateDetails: (aadharId: number, data: Partial<Guest>) => api.put(`/guests/update-details/${aadharId}`, data),
  getPending: (pgId: number) => api.get(`/guests/pg/${pgId}/pending`),
  assignRoom: (aadharId: number, roomId: number) => api.put(`/guests/assign-room/${aadharId}`, { roomId }),
};

// Warden API
export const wardenAPI = {
  create: (data: Omit<Warden, 'UserId'>) => api.post('/wardens/create', data),
  getAll: () => api.get('/wardens/view'),
  getByPG: (pgId: number) => api.get(`/wardens/pg/${pgId}`),
  delete: (userId: number) => api.delete(`/wardens/delete/${userId}`),
  updateSalaryStatus: (userId: number, salStatus: boolean) => api.put(`/wardens/update-salstatus/${userId}`, { Sal_status: salStatus }),
  update: (userId: number, data: Partial<Warden>) => api.put(`/wardens/update/${userId}`, data),
};

// Worker API
export const workerAPI = {
  create: (data: Worker) => api.post('/workers/create', data),
  getByPG: (pgId: number) => api.get(`/workers/pg/${pgId}`),
  getByJob: (pgId: number, job: string) => api.get(`/workers/pg/${pgId}/job/${job}`),
  delete: (aadharId: number) => api.delete(`/workers/${aadharId}`),
  updateSalaryStatus: (aadharId: number, salStatus: boolean) => api.put(`/workers/update-salstatus/${aadharId}`, { Sal_status: salStatus }),
  update: (aadharId: number, data: Partial<Worker>) => api.put(`/workers/update/${aadharId}`, data),
};