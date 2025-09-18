import { getGameInfo, handleDownload } from "@/api/download";
import { Loader2, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { GOOGLE_DRIVE_URL } from "@/api/download";
import { Button } from "../ui/button";

interface DownloadButtonProps {
  className?: string;
  showVersion?: boolean;
}

const DownloadButton = ({
  className,
  showVersion = true,
}: DownloadButtonProps) => {
  const [gameInfo, setGameInfo] = useState<{
    downloadLink: {
      url: string;
      from: string;
    }[];
    lastUpdated: string;
    latestInfo: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameInfo = async () => {
      try {
        setLoading(true);
        const info = await getGameInfo();
        setGameInfo(info);
        setError(null);
      } catch {
        setGameInfo({
          downloadLink: [
            {
              url: GOOGLE_DRIVE_URL,
              from: "Google Drive",
            },
          ],
          lastUpdated: "2025-09-17",
          latestInfo: "0.1.5",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGameInfo();
  }, []);

  const handleClick = (downloadLink: string) => {
    if (gameInfo && !loading) {
      handleDownload(downloadLink);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {gameInfo?.downloadLink &&
        gameInfo?.downloadLink.map((link, index) => (
          <Button
            key={index}
            onClick={() => handleClick(link.url)}
            disabled={loading || !gameInfo}
            className={`
          ${
            loading || !gameInfo
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 hover:scale-105"
          } 
          text-white px-8 py-3 text-lg rounded-full transition-all transform
          ${className}
        `}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Download ({link.from})
              </>
            )}
          </Button>
        ))}

      {showVersion && gameInfo && !loading && (
        <div className="flex flex-col items-center gap-1 text-sm text-white">
          <span>Latest version: {gameInfo.latestInfo}</span>
          <span>Last updated: {gameInfo.lastUpdated}</span>
        </div>
      )}

      {error && (
        <span className="text-sm text-red-500">Using fallback data</span>
      )}
    </div>
  );
};

export default DownloadButton;
