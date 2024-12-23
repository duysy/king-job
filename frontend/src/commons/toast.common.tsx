import "@/custom-css/customToastStyles.css"; // Custom CSS file for styling
import { toast, ToastOptions, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastOptions: ToastOptions = {
  position: "top-right" as ToastPosition,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  className: "custom-toast", // Custom CSS class
  bodyClassName: "custom-toast-body",
  progressClassName: "custom-toast-progress",
};

// Remove string concatenation and use JSX for the icon and message
const showToast = (
  message: any,
  type: "default" | "success" | "error" | "info" | "warning" = "default",
  options: ToastOptions = {}
) => {
  switch (type) {
    case "success":
      toast.success(<div>{message}</div>, {
        ...toastOptions,
        ...options,
      });
      break;
    case "error":
      toast.error(<div>{message}</div>, {
        ...toastOptions,
        ...options,
      });
      break;
    case "info":
      toast.info(<div>{message}</div>, {
        ...toastOptions,
        ...options,
      });
      break;
    case "warning":
      toast.warn(<div>{message}</div>, {
        ...toastOptions,
        ...options,
      });
      break;
    default:
      toast(message, { ...toastOptions, ...options });
  }
};
export default showToast;
