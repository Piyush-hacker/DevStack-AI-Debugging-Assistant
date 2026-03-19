export const formatDateTime = (value) => {
  if (!value) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
};

export const getErrorPreview = (value, maxLength = 90) => {
  if (!value) {
    return "No error message saved.";
  }

  return value.length > maxLength ? `${value.slice(0, maxLength).trim()}...` : value;
};
