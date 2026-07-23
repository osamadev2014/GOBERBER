export type StoreId = string;

export interface Store {
  id: StoreId;
  name: string;
  city: string;
  location: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  deliveryRadius?: number;
  workingHours?: string;
  address?: string;
}

export const STORES: readonly Store[] = [
  {
    id: "olaya",
    name: "فرع العليا",
    city: "الرياض",
    location: { lat: 24.7118, lng: 46.6747 },
    isActive: true,
  },
  {
    id: "nargis",
    name: "فرع النرجس",
    city: "الرياض",
    location: { lat: 24.785, lng: 46.636 },
    isActive: true,
  },
  {
    id: "malqa",
    name: "فرع الملقا",
    city: "الرياض",
    location: { lat: 24.775, lng: 46.605 },
    isActive: true,
  },
  {
    id: "yasmin",
    name: "فرع الياسمين",
    city: "الرياض",
    location: { lat: 24.745, lng: 46.645 },
    isActive: true,
  },
  {
    id: "rawdah",
    name: "فرع الروضة",
    city: "الرياض",
    location: { lat: 24.685, lng: 46.675 },
    isActive: true,
  },
  {
    id: "rimal",
    name: "فرع الرمال",
    city: "الرياض",
    location: { lat: 24.635, lng: 46.715 },
    isActive: true,
  },
  {
    id: "qurayyat",
    name: "فرع قرطبة",
    city: "الرياض",
    location: { lat: 24.735, lng: 46.695 },
    isActive: true,
  },
  {
    id: "shifa",
    name: "فرع الشفا",
    city: "الرياض",
    location: { lat: 24.665, lng: 46.735 },
    isActive: true,
  },
  {
    id: "suwaidi",
    name: "فرع السويدي",
    city: "الرياض",
    location: { lat: 24.655, lng: 46.645 },
    isActive: true,
  },
  {
    id: "khaleej",
    name: "فرع الخليج",
    city: "الرياض",
    location: { lat: 24.725, lng: 46.755 },
    isActive: true,
  },
  {
    id: "aared",
    name: "فرع العارض",
    city: "الرياض",
    location: { lat: 24.795, lng: 46.695 },
    isActive: true,
  },
  {
    id: "hamra",
    name: "فرع الحمراء",
    city: "الرياض",
    location: { lat: 24.705, lng: 46.625 },
    isActive: true,
  },
];
