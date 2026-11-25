export interface StreetZone {
  zone: "city" | "remote" | "outside";
  price: number;
}

export interface AddressData {
  street: string;
  house: string;
  apartment: string;
  entrance: string;
  intercom: "yes" | "no";
  intercomCode: string;
  zone: StreetZone | null;
  notes: string;
  paymentMethod: "courier" | "online";
}
