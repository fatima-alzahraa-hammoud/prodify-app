export const throwError = ({ message, res, status = 500 }) => {
  res.status(status).json({ error: message });
};
