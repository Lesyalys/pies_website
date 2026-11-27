import { useEffect, useRef, useState } from "react";

interface Props {
  productName: string;
  uniqueId: number;
  onDone: () => void;
}

export const AddToCartBanner = ({ productName, uniqueId, onDone }: Props) => {
  const [visible, setVisible] = useState(true);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onDoneRef.current();
    }, 2000);
    return () => clearTimeout(timer);
  }, [uniqueId]);

  if (!visible) return null;

  return (
    <div className="add-banner">
      <span className="add-banner__icon">✓</span>
      <span>«{productName}» добавлен в корзину</span>
    </div>
  );
};