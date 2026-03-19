const variantClasses = {
  error: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-sky-200 bg-sky-50 text-sky-700"
};

function ErrorAlert({ message, variant = "error" }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${variantClasses[variant] || variantClasses.error}`}
    >
      {message}
    </div>
  );
}

export default ErrorAlert;
