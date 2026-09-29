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

export type CreateDonationInput = Partial<
  Pick<
    Donations,
    | "instruction_note"
    | "item_name"
    | "method"
    | "account_name"
    | "account_number"
    | "qr_url"
    | "is_active"
  >
> &
  Pick<Donations, "type">;
