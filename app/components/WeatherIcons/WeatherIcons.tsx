"use client";

type Props = { code: number | null };

function weatherCodeToEmoji(code: number | null): string {
  if (code == null) return "Okänt väder ❓";
  if (code === 0) return "Klart ☀️";
  if ([1, 2].includes(code)) return "Mestadels klart ⛅";
  if (code === 3) return "Mulet ☁️";
  if ([45, 48].includes(code)) return "Dimma 🌫️";
  if ([51, 53, 55].includes(code)) return "Duggregn 🌦️";
  if ([56, 57].includes(code)) return "Hagel 🌧️";
  if ([61, 63, 65].includes(code)) return "Regn 🌧️";
  if ([66, 67].includes(code)) return "Regn/snö 🌧️❄️";
  if ([71, 73, 75].includes(code)) return "Snö ❄️";
  if ([77].includes(code)) return "Snöbyar 🌨️";
  if ([80, 81, 82].includes(code)) return "Regnskurar 🌧️";
  if ([85, 86].includes(code)) return "Snöskurar 🌨️";
  if ([95, 96, 99].includes(code)) return "Åska ⛈️";
  return "Okänt väder ❓";
}

export default function WeatherIcons({ code }: Props) {
  return <>{weatherCodeToEmoji(code)}</>;
}
