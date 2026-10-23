export interface DownloadLink {
  url: string;
  from: string;
}
export interface GameInfo {
  downloadLink: DownloadLink[];
  lastUpdated: string;
  latestInfo: string;
}
export interface GameUpdate {
  id: string;
  name: string;
  description: string;
  version: string;
  date: string;
  changes: string[];
}
export interface Update extends GameUpdate {
  isNew: boolean;
  formattedDate: string;
}
export interface PaginatedUpdates {
  updates: Update[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUpdates: number;
    hasMore: boolean;
    limit: number;
  };
}
export interface CountryDownloads {
  countries: Record<string, number>;
  totalDownloads: number;
}
export interface DownloadLog {
  time: string;
  ip: string | string[] | undefined;
  country: string | string[];
}
