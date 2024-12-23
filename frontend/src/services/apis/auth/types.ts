export interface IAuthLogin {
  wallet_address: string;
}

export interface IResponseAuthLogin {
  token: string;
  username: string;
  wallet_address: string;
  image: string;
  name: string;
}

export interface IUserInfo {
  username: string;
  wallet_address: string;
  image: string;
  name: string;
}

export interface IResponseUploadFile {
  file_url: string;
  file_name: string;
}
