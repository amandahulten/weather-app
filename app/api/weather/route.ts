import { NextResponse } from "next/server";

// Types
type Place = {
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
};

type ForecastAPI = {
    current?: {
        temperature_2m?: number;
        relative_humidity_2m?: number;
        precipitation?: number;
        weather_code?: number;
        wind_speed_10m?: number;
    };
    daily?: {
        time?: string[];
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
        precipitation_sum?: number[];
        weather_code?: number[];
    };
};

export async function GET(req: Request) {
    const cityName = new URL(req.url).searchParams.get("city")?.trim();
    if (!cityName) {
        return NextResponse.json({ error: "Var vänlig skriv in en stad/plats" }, { status: 400 });
    }

    // Geocoding
    let place: Place;
    try {
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                cityName
            )}&count=1&language=sv&format=json`
        );
        const geoJson = (await geoResponse.json()) as { results?: Place[] };

        if (!geoResponse.ok || !geoJson.results?.length) {
            return NextResponse.json(
                { error: `Ingen plats hittades för "${cityName}"` },
                { status: 404 }
            );
        }

        place = geoJson.results[0];
    } catch {
        return NextResponse.json(
            { error: "Kunde inte hämta platsen, vänligen försök igen" },
            { status: 502 }
        );
    }

    // Forecast
    const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
    forecastUrl.searchParams.set("latitude", String(place.latitude));
    forecastUrl.searchParams.set("longitude", String(place.longitude));
    forecastUrl.searchParams.set("timezone", "auto");

    forecastUrl.searchParams.set(
        "current",
        "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m"
    );
    forecastUrl.searchParams.set(
        "daily",
        "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code"
    );

    let forecast: ForecastAPI;
    try {
        const forecastResponse = await fetch(forecastUrl.toString());
        const forecastJson = (await forecastResponse.json()) as ForecastAPI;

        if (
            !forecastResponse.ok ||
            !forecastJson.current ||
            !forecastJson.daily ||
            !forecastJson.daily.time?.length
        ) {
            return NextResponse.json({ error: "Ofullständig väderdata" }, { status: 502 });
        }

        forecast = forecastJson;
    } catch {
        return NextResponse.json({ error: "Kunde inte hämta väderdata" }, { status: 502 });
    }

    const result = {
        place: {
            label: [place.name, place.country].join(", "),
        },
        current: {
            temperature: forecast.current?.temperature_2m ?? null,
            humidity: forecast.current?.relative_humidity_2m ?? null,
            precipitation: forecast.current?.precipitation ?? null,
            weatherCode: forecast.current?.weather_code ?? null,
            wind: forecast.current?.wind_speed_10m ?? null,
        },
        daily: (forecast.daily?.time ?? []).slice(0, 5).map((date, i) => ({
            date,
            temperatureMax: forecast.daily?.temperature_2m_max?.[i] ?? null,
            temperatureMin: forecast.daily?.temperature_2m_min?.[i] ?? null,
            precipitationSum: forecast.daily?.precipitation_sum?.[i] ?? null,
            weatherCode: forecast.daily?.weather_code?.[i] ?? null,
        })),
    };

    return NextResponse.json(result, {
        headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
        },
    });
}
