export function checkArrayEquality(a, b) {
  console.log('AAAAAAA', (
    a.every((v) => b.includes(v)) &&
    b.every((v) => a.includes(v))
  ));

  return (
    a.every((v) => b.includes(v)) &&
    b.every((v) => a.includes(v))
  );
}
