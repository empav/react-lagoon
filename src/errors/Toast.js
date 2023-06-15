import { toast } from 'react-toastify';

class Toast {
  static error(message) {
    toast.error(message || 'Please, provide a message for error notification');
  }
  static success(message) {
    toast.success(
      message || 'Please, Provide a message for success notification'
    );
  }
}

export default Toast;
