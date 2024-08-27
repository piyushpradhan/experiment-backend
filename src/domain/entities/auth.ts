export interface LoginResponseModel {
  id: string;
  displayName: string;
  emails: Array<string>;
}

export interface User {
  uid: string;
  name: string;
  email: string;
}
