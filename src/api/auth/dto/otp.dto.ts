export class OTPVerifyDto {
  email: string;
  otp: string;
  type: 'is_first_auth' | 'is_forget_password';
}
export class OTPRefreshDTO {
  email: string;
  type: 'is_first_auth' | 'is_forget_password';
}
export class UpdatePasswordDto {
  password: string;
}
