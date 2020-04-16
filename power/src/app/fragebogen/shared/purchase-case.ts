export interface PurchaseCase {
  id: string;         // Kauffallkennzeichen
  pin: string;
  date: string;       // Kaufdatum
  price: number;      // Kaufpreis
  parcelId: string;   // Flurstückskennzeichen
  parcelArea: number; // Flurstücksfläche
  address: Location;  // Lagebezeichnung
  // TODO Add more data as needed
}

export interface Location {
  street: string;
  houseNumber: number;
}
