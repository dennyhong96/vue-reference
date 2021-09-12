export const validateEmail = (email: string): boolean => {
  return email.length >= 4 && email.length > 0;
};
