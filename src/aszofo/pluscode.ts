// Open Location Code ("plus code") for a point. Google Maps and most map
// apps accept these, which helps where there's no street address.

const ALPHABET = "23456789CFGHJMPQRVWX";

// Full 10-digit code, e.g. "8FVGWR86+XV".
export function plusCode(lat: number, lng: number): string {
  const latInt = Math.floor(
    (Math.min(Math.max(lat, -90), 89.9999999) + 90) * 8000,
  );
  const lngInt = Math.floor(((((lng + 180) % 360) + 360) % 360) * 8000);
  let code = "";
  for (let k = 4; k >= 0; k--) {
    const place = 20 ** k;
    code += ALPHABET[Math.floor(latInt / place) % 20];
    code += ALPHABET[Math.floor(lngInt / place) % 20];
    if (code.length === 8) code += "+";
  }
  return code;
}

// The short form Google shows next to a place name: "WR86+XV Aszófő".
export function shortPlusCode(
  lat: number,
  lng: number,
  locality: string,
): string {
  return `${plusCode(lat, lng).slice(4)} ${locality}`;
}
