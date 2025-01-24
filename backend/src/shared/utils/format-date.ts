export const fromDashToSlash = (date: string): string => {
  const year: string = date.substring(0, 4);
  const month: string = date.substring(5, 7);
  const day: string = date.substring(8, 10);

  return `${day}/${month}/${year}`;
};

export const formatDateToDash = (date: Date): string => {
  return date.toLocaleDateString('en-CA');
};
