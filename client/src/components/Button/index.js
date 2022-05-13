import "./styles.scss";

export default function Button({ bg, children, ...props }) {
  return (
    <button
      {...props}
      className={`button ${bg ? bg : ""} ${
        props.className ? props.className : ""
      }`}
    >
      {children}
    </button>
  );
}
