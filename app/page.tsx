"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import WeatherIcons from "./components/WeatherIcons/WeatherIcons";

type WeatherResult = {
  place: { label: string };
  current: {
    temperature: number | null;
    humidity: number | null;
    precipitation: number | null;
    weatherCode: number | null;
    wind: number | null;
  };
  daily: Array<{
    date: string;
    temperatureMax: number | null;
    temperatureMin: number | null;
    precipitationSum: number | null;
    weatherCode: number | null;
  }>;
};

type TemperatureUnit = "C" | "F";

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeatherResult | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("C");

  useEffect(() => {
    const savedUnit =
      typeof window !== "undefined" ? localStorage.getItem("unit") : null;
    if (savedUnit === "C" || savedUnit === "F") setTemperatureUnit(savedUnit);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("unit", temperatureUnit);
    }
  }, [temperatureUnit]);

  const convertCelsiusToFahrenheit = (celsius: number) =>
    (celsius * 9) / 5 + 32;

  const formatTemperature = (celsius: number | null) => {
    if (celsius == null) return "—";
    const value =
      temperatureUnit === "C" ? celsius : convertCelsiusToFahrenheit(celsius);
    return String(Math.round(value));
  };

  const temperatureUnitLabel = `°${temperatureUnit}`;

  async function fetchWeather() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Kunde inte hämta väder");
      setData(json as WeatherResult);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Något gick fel");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.weatherContainer}>
      <h1>☀️ AMHI ☀️</h1>
      <p className={styles.headingDescription}>
        <i>Amandas meteorologiska och hydrologiska institut</i>
      </p>

      <div className={styles.searchContainer}>
        <div className={styles.search}>
          <input
            aria-label="Stad eller plats"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Skriv stad…"
          />
          <button onClick={fetchWeather}>Sök</button>
        </div>
        {loading && (
          <p className={styles.loading} aria-live="polite">
            Laddar…
          </p>
        )}
        {error && (
          <p className={styles.error} aria-live="assertive">
            {error}
          </p>
        )}
      </div>

      {data && !loading && !error && (
        <section className={styles.results}>
          <div className={styles.currentWeatherContainer}>
            <div className={styles.placeContainer}>
              <h2 className={styles.place}>{data.place.label}</h2>

              <div
                className={styles.unitToggle}
                role="group"
                aria-label="Temperaturenhet"
              >
                <p>Temperaturenhet:</p>
                <button
                  type="button"
                  title="Växla till Celsius/Fahrenheit"
                  className={
                    temperatureUnit === "C"
                      ? styles.unitActive
                      : styles.unitButton
                  }
                  onClick={() => setTemperatureUnit("C")}
                >
                  °C
                </button>
                <button
                  type="button"
                  className={
                    temperatureUnit === "F"
                      ? styles.unitActive
                      : styles.unitButton
                  }
                  onClick={() => setTemperatureUnit("F")}
                >
                  °F
                </button>
              </div>
            </div>

            <div className={styles.currentWeather}>
              <div className={styles.icon}>
                <h3>
                  <WeatherIcons code={data.current.weatherCode} />
                </h3>
              </div>
              <div className={styles.temperature}>
                <h3 className={styles.label}>Just nu:</h3>
                <div className={styles.value}>
                  <h2>
                    {formatTemperature(data.current.temperature)}
                    {temperatureUnitLabel}
                  </h2>
                </div>
              </div>
              <div className={styles.extra}>
                <p>💧 Luftfuktighet: {data.current.humidity ?? "—"}%</p>
                <p>🌧️ Nederbörd: {data.current.precipitation ?? "—"} mm</p>
                <p>🌬️ Vind: {data.current.wind ?? "—"} km/h</p>
              </div>
            </div>
          </div>

          <div className={styles.daily}>
            <h3>5-dygnsprognos</h3>
            <div className={styles.days}>
              {data.daily.map((d) => (
                <div key={d.date} className={styles.day}>
                  <p className={styles.date}>
                    {new Date(d.date).toLocaleDateString("sv-SE", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className={styles.icon}>
                    <h3>
                      <WeatherIcons code={d.weatherCode} />
                    </h3>
                  </div>
                  <div className={styles.temps}>
                    <div>
                      <p>
                        Min:{" "}
                        <b>
                          {formatTemperature(d.temperatureMin)}
                          {temperatureUnitLabel}
                        </b>
                      </p>
                    </div>
                    <div>
                      <p>
                        Max:{" "}
                        <b>
                          {formatTemperature(d.temperatureMax)}
                          {temperatureUnitLabel}
                        </b>
                      </p>
                    </div>
                  </div>
                  <div className={styles.precip}>
                    <p>
                      Nederbörd: <b>{d.precipitationSum ?? "—"} mm </b>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
