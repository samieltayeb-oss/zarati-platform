import type { Role } from './roles'

export type SudanState =
  | 'khartoum' | 'kassala' | 'gedaref' | 'sennar'
  | 'blue-nile' | 'white-nile' | 'north-kordofan'
  | 'south-kordofan' | 'northern' | 'river-nile'
  | 'red-sea' | 'gezira'

export interface User {
  id: string
  name: string
  nameAr: string
  email: string
  phone: string
  role: Role
  state: SudanState
  createdAt: string
}

export interface FarmerProfile extends User {
  farmSize: number
  farmSizeUnit: 'feddan' | 'hectare'
  crops: string[]
}
