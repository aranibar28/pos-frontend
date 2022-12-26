export interface Category {
  _id: string;
  title: string;
  description: string;
  status: boolean;
  audit_create_user: boolean;
  audit_create_date: Date;
  audit_update_user: boolean | null;
  audit_update_date: Date | null;
  audit_delete_user: null;
  audit_delete_date: null;
}
