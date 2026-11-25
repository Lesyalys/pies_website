import { useEffect, useState } from "react";

interface Props {
  productName: string;
  onDone: () => void;
}

export const AddToCartBanner = ({ productName, onDone }: Props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDone();
    }, 30000);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div className="add-banner">
      <span className="add-banner__icon">✓</span>
      <span>«{productName}» добавлен в корзину</span>
    </div>
  );
};
