import React from "react";
import "../../../assets/css/Button.css";
function Button({
  type,
  disabled,
  onClick,
  children,
  className,
  icon,
  id,
  style,
  key,
}) {
  return (
    <button
      id={id || ""}
      type={"button" || type}
      className={`btn btn-sm ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={"" || style}
      key={key || ""}
    >
      {children}
      {icon && <span className="label-icon">{icon}</span>}
    </button>
  );
}
export default Button;
