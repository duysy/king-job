// src/utils/errorUtils.ts

import showToast from "@/commons/toast.common";

export const handleErrorMessage = (error: any, customMessage: string) => {
  if (error.response && error.response.data && error.response.data.message) {
    showToast(error.response.data.message);
  } else if (error.message) {
    showToast(error.message);
  } else {
    showToast(customMessage);
  }
};
