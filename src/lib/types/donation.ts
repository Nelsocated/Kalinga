export interface Donations {
  id: string;
  shelter_id: string;
  type: "goods" | "monetary";
  instruction_note: string | null;
  item_name: string[] | null;
  method: string | null;
  account_name: string | null;
  account_number: string | null;
  qr_url: string | null;
  is_active: boolean | null;
  created_at: string;
}

export interface MonetaryMethod {
  id?: string;
  method: string;
  account_name: string;
  account_number: string;
  qr_url: string;
}

/** A shelter's whole donation setup, as the edit form reads and saves it. */
export interface DonationSettings {
  enabled: boolean;
  monetary: MonetaryMethod[];
  goods: { id?: string; items: string[]; note: string };
}
