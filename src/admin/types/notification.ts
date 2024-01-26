export interface Notification {
  id: string;
  code: string;
  created_at: Date;
  // params: Record<string, any>;
  params?: {
    quantity?: string;
    user?: string;
    // person?: string;
    staff?: string | {};
    date?: Date;
    subject?: string;
    mys_id?: string;
  };
  unread: boolean;
  exception?: string
}

export type PushNotification = {
  staff_code: string
  title: string
  body: string
}