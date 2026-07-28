// Response sukses standar untuk API
export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

// Response error standar untuk API, termasuk error validasi opsional
export type ApiError = {
  success: false;
  message: string;
  errors?: Array<{ path: string[]; message: string }>;
};
