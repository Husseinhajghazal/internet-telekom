"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

/* ── Turkey provinces GeoJSON ── */
const geoUrl =
  "https://raw.githubusercontent.com/alpers/Turkey-Maps-GeoJSON/master/tr-cities.json";

/* ── City markers [longitude, latitude] ── */
const cities = [
  { name: "إسطنبول", coordinates: [28.9784, 41.0082] },
  { name: "أنقرة", coordinates: [32.8597, 39.9334] },
  { name: "إزمير", coordinates: [27.1287, 38.4192] },
  { name: "أنطاليا", coordinates: [30.7133, 36.8969] },
  { name: "بورصة", coordinates: [29.061, 40.1885] },
  { name: "أضنة", coordinates: [35.3213, 37.0] },
  { name: "غازي عنتاب", coordinates: [37.3833, 37.0662] },
  { name: "قونية", coordinates: [32.4932, 37.8746] },
  { name: "طرابزون", coordinates: [39.7168, 41.0027] },
  { name: "ديار بكر", coordinates: [40.2306, 37.9144] },
  { name: "سامسون", coordinates: [36.3313, 41.2928] },
  { name: "مرسين", coordinates: [34.6415, 36.8121] },
  { name: "إسكي شهير", coordinates: [30.5206, 39.7767] },
  { name: "كايسري", coordinates: [35.4787, 38.7312] },
  { name: "دنيزلي", coordinates: [29.0864, 37.7765] },
  { name: "ماردين", coordinates: [40.7245, 37.3212] },
  { name: "وان", coordinates: [43.3832, 38.4891] },
  { name: "أرضروم", coordinates: [41.2679, 39.9043] },
  { name: "ملاطية", coordinates: [38.3095, 38.3552] },
  { name: "شانلي أورفا", coordinates: [38.7969, 37.1591] },
];

const TurkeyMap = () => {
  return (
    <div className="w-full relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [35.5, 39.2],
          scale: 2600,
        }}
        width={800}
        height={380}
        style={{ width: "100%", height: "auto" }}
      >
        {/* ── provinces ── */}
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="rgba(24, 162, 227, 0.12)"
                stroke="#18a2e3"
                strokeWidth={1.5}
                strokeOpacity={0.35}
                style={{
                  default: { outline: "none" },
                  hover: {
                    fill: "rgba(227, 139, 24, 0.28)",
                    stroke: "#e38e18ff",
                    strokeWidth: 1.5,
                    strokeOpacity: 1,
                    outline: "none",
                  },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {/* ── city markers ── */}
        {cities.map((city, i) => (
          <Marker key={city.name} coordinates={city.coordinates}>
            {/* pulse ring for main cities */}
            {city.main && (
              <circle
                r={10}
                fill="none"
                stroke="#f36802"
                strokeWidth={1.5}
                strokeOpacity={0.4}
                className="animate-ping-slow"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            )}
            {/* dot */}
            <circle
              r={city.main ? 4 : 2.5}
              fill={city.main ? "#f36802" : "#18a2e3"}
              stroke={city.main ? "#ffb245" : "#18a2e3"}
              strokeWidth={city.main ? 1.5 : 0.8}
              strokeOpacity={0.6}
              filter="url(#glow)"
            />
            {/* label */}
            {city.main && (
              <text
                textAnchor="middle"
                y={-14}
                fill="white"
                fontSize={9}
                fontWeight={700}
                opacity={0.9}
                style={{ fontFamily: "var(--font-cairo), sans-serif" }}
              >
                {city.name}
              </text>
            )}
          </Marker>
        ))}

        {/* SVG filter for glow */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </ComposableMap>
    </div>
  );
};

export default TurkeyMap;
