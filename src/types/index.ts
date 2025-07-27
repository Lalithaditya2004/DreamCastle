export interface Owner {
  UserID: number;
  Name: string;
  Password: string;
  Phno: number;
  Email: string;
}

export interface PG {
  PGId: number;
  OwnerID: number;
  WardenID?: number;
  Nofloors: number;
  Revenue: number;
  Name: string;
  Address: string;
  City: string;
}

export interface Room {
  RoomId: number;
  RoomNo: string;
  FloorNo: number;
  Beds: number;
  Vacancies: number;
  last_cleaned: string;
  Status: 'Full' | 'Empty' | 'Partial';
  PGId: number;
}

export interface Guest {
  AadharID: number;
  G_name: string;
  RoomId?: number;
  Fee: number;
  Fee_status: 'Paid' | 'Pending';
  DOJ: string;
  DOL?: string;
  Phno: number;
  DOP?: string;
  PGId: number;
}

export interface Warden {
  UserId: number;
  Name: string;
  Password: string;
  Email: string;
  Phno: number;
  Salary: number;
  Sal_status: boolean;
}

export interface Worker {
  AadharId: number;
  Name: string;
  Phno: number;
  Salary: number;
  Sal_status: boolean;
  Job: string;
  ReportsTo?: number;
  PGId: number;
  WorkerName?: string;
  ReportsTo?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}