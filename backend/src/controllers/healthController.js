export const getHealth = (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    service: "devstack-backend"
  });
};
