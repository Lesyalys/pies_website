import { useEffect } from "react";

interface Props {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast = ({ message, isVisible, onClose }: Props) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="toast">
      <span className="toast__icon">✓</span>
      <span>{message}</span>
    </div>
  );
};
