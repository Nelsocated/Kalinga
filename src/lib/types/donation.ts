export interface Donations {
  id: string;
  shelter_id: string;
  type: "goods" | "monetary";
  instruction_note: string;
  item_name: string;
  method: string;
  account_name: string;
  account_number: string;
  qr_url: string;
  is_active: string;
  created_at: string;
}
