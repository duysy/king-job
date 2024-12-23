import { createMutation } from "react-query-kit";
import { authLogin, uploadFileRequest } from "./request";

export const useLogin = createMutation({
  mutationFn: authLogin,
});

export const useUploadFile = createMutation({
  mutationFn: uploadFileRequest,
});
