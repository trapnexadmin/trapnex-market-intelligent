export type CorporateActionType =
  | "DIVIDEND"
  | "BONUS"
  | "SPLIT"
  | "RIGHTS"
  | "DEMERGER"
  | "BUYBACK"
  | "OTHER";

export interface CorporateAction {
  id: string;
  symbol: string;
  companyName: string | null;
  type: CorporateActionType;
  purpose: string;
  exDate: string | null;
  recordDate: string | null;
  announcementDate: string | null;
  source: string;
  url: string | null;
}
