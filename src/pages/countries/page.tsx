import { useState, useEffect } from "react";
import { getDownloadsData } from "@/lib/download";

const countryNames: Record<string, string> = {
  US: "United States",
  DE: "Germany",
  IN: "India",
  GB: "United Kingdom",
  FR: "France",
  CA: "Canada",
  DO: "Dominican Republic",
  PH: "Philippines",
  ID: "Indonesia",
  JP: "Japan",
  ES: "Spain",
  BR: "Brazil",
  NL: "Netherlands",
  MX: "Mexico",
  IT: "Italy",
  AU: "Australia",
  PT: "Portugal",
  PK: "Pakistan",
  BM: "Bermuda",
  SG: "Singapore",
  CN: "China",
  AR: "Argentina",
  JM: "Jamaica",
  SE: "Sweden",
  CL: "Chile",
  CO: "Colombia",
  GR: "Greece",
  PE: "Peru",
  MY: "Malaysia",
  HK: "Hong Kong",
  BE: "Belgium",
  PL: "Poland",
  VN: "Vietnam",
  AT: "Austria",
  TR: "Turkey",
  IL: "Israel",
  DK: "Denmark",
  CU: "Cuba",
  NO: "Norway",
  NP: "Nepal",
  UY: "Uruguay",
  TH: "Thailand",
  BO: "Bolivia",
  ZA: "South Africa",
  NG: "Nigeria",
  HT: "Haiti",
  BB: "Barbados",
  TT: "Trinidad and Tobago",
  DZ: "Algeria",
  CR: "Costa Rica",
  VE: "Venezuela",
  SA: "Saudi Arabia",
  HN: "Honduras",
  LK: "Sri Lanka",
  KH: "Cambodia",
  ZW: "Zimbabwe",
  UNKNOWN: "Unknown",
  PA: "Panama",
  KR: "South Korea",
  FI: "Finland",
  LC: "Saint Lucia",
  CH: "Switzerland",
  PR: "Puerto Rico",
  TW: "Taiwan",
  LT: "Lithuania",
  MA: "Morocco",
  IE: "Ireland",
  AL: "Albania",
  LV: "Latvia",
  EG: "Egypt",
  BG: "Bulgaria",
  GY: "Guyana",
  BS: "Bahamas",
  NZ: "New Zealand",
  HR: "Croatia",
  RS: "Serbia",
  CM: "Cameroon",
  LB: "Lebanon",
  ZM: "Zambia",
  AE: "United Arab Emirates",
  NE: "Niger",
  GT: "Guatemala",
  UA: "Ukraine",
  EC: "Ecuador",
  MK: "North Macedonia",
  DM: "Dominica",
  BA: "Bosnia and Herzegovina",
  MU: "Mauritius",
  MM: "Myanmar",
  PS: "Palestine",
  HU: "Hungary",
  LA: "Laos",
  BD: "Bangladesh",
  RU: "Russia",
  SC: "Seychelles",
  KW: "Kuwait",
  OM: "Oman",
};

const getFlagEmoji = (countryCode: string): string => {
  if (countryCode === "UNKNOWN") return "🏳️";

  // Convert country code to flag emoji using regional indicator symbols
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

export const CountryDownloads = () => {
  const [data, setData] = useState<{
    countries: Record<string, number>;
    totalDownloads: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getDownloadsData();

        if (result) {
          setData(result);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error("Error fetching downloads data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">📊 Downloads by Country</h2>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading downloads data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">📊 Downloads by Country</h2>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 mb-2">Error loading data</p>
          <p className="text-gray-600 text-sm">
            {error || "Unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  const sorted = Object.entries(data.countries).sort(([, a], [, b]) => b - a);
  const total = sorted.reduce((acc, [, value]) => acc + value, 0);

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📊 Downloads by Country</h2>
      <table className="min-w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">🌍 Country</th>
            <th className="text-right p-2">📥 Downloads</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(([code, count]) => (
            <tr
              key={code}
              className="border-t border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="p-2 flex items-center gap-2">
                <span className="text-xl">{getFlagEmoji(code)}</span>
                <span>{countryNames[code] || code}</span>
              </td>
              <td className="p-2 text-right font-medium">
                {count.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-100">
          <tr>
            <th className="text-left p-2 font-bold">🌎 Total</th>
            <th className="text-right p-2 font-bold">
              {data.totalDownloads.toLocaleString()}
            </th>
          </tr>
        </tfoot>
      </table>
      <p className="mt-4 text-sm text-gray-500">
        📈 Total downloads: <strong>{total.toLocaleString()}</strong>
      </p>
    </div>
  );
};
