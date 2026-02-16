import { useState, type JSX } from "react";
interface ProfileDropdownProps {
  buttonLabel?: JSX.Element;
  className?: string;
  items: {
    title?: string;
    icon?: JSX.Element;
    url?: string;
    action?: () => void;
  }[];
}
export const Dropdown = ({
  className,
  buttonLabel,
  items,
}: ProfileDropdownProps) => {
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };
  const handleItemClick = async (item: any) => {
    if (item.action) {
      await item.action();
    }
    if (item.url) {
      globalThis.location.href = item.url;
    }
    setOpen(false);
  };
  return (
    <div>
      <button
        className={className}
        onClick={handleToggle}
      >
        {buttonLabel}
      </button>
      {open && (
        <div className="dropdownMenu">
          <ul>
            {items.map((item, index) => (
              <li
                key={index}
              >
                <button className="dropdownButtons" onClick={() => handleItemClick(item)}>
                  {item.icon} {item.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};