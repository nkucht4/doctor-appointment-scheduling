import React from "react";

export default function NotificationBell({ count, onClick }) {
  return (
    <button
      type="button"
      className="btn btn-link position-relative p-0"
      onClick={onClick}
      aria-label="Powiadomienia"
      style={{ color: count > 0 ? "red" : "black" }}
    >
      <i className="bi bi-bell"></i>
      {count > 0 && (
        <span
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fs-10"
          style={{ transform: "translate(50%, -50%)" }}
        >
          {count}
          <span className="visually-hidden">nowe powiadomienia</span>
        </span>
      )}
    </button>
  );
}
