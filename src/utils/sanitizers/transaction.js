export function cleanName(name) {
  let cleanName = name;

  const trimmedName = name.trim();
  cleanName = trimmedName;
  cleanName = cleanName.replace(/[^0-9a-zA-Z ]/g, ' ')

  const cleanNameSplitted = cleanName.split(' ').filter(
    value => value !== ''
  );

  return cleanNameSplitted.join(' ');
}

export function parseBeneficiaryName(name) {
  if (!Boolean(name)) return;

  let [firstName, lastName, ...otherNames] = cleanName(name).split(' ');
  otherNames = otherNames.join(" ") || undefined;

  return {firstName, lastName, otherNames}
}
