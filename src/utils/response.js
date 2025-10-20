// Reusable API response formatter
export const formatResponse = (success, message, data = null) => {
  return { success, message, data };
};
