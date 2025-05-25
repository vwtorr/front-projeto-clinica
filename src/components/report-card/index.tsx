import { useState } from "react";

interface ReportCardProps {
  title: string;
  description: string;
  excelUrl: string;
  pdfUrl: string;
  showDateFilter?: boolean;
}

export default function ReportCard({ title, description, excelUrl, pdfUrl, showDateFilter = true }: ReportCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleExpand = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as Element | null;
    if (!target) return;
    if (target.closest('input') || target.closest('select')) return;

    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="border-4 border-[#2196F3] bg-[#2196F3] p-6 rounded-lg cursor-pointer mb-6"
      onClick={handleExpand}
    >
      <h2 className="text-white text-2xl font-bold mb-2" style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}>
        {title}
      </h2>

      <p className="text-white text-sm mb-4">{description}</p>

      {isExpanded && (
        <div>
          {showDateFilter && (
            <div className="flex space-x-4 mb-4">
              <div className="flex flex-col space-y-2 w-1.2">
                <label htmlFor="startDate" className="text-white">Data Inicial:</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 rounded-md w-full"
                />
              </div>
              <div className="flex flex-col space-y-2 w-1.2">
                <label htmlFor="endDate" className="text-white">Data Final:</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 rounded-md w-full"
                />
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="flex space-x-4">
              <a href={excelUrl} target="_blank" className="flex items-center space-x-2 border-2 border-[#03BB85] bg-white p-2 rounded-md">
                <span className="text-[#03BB85]">Planilha</span>
              </a>

              <a href={pdfUrl} target="_blank" className="flex items-center space-x-3 border-2 border-[#FF5733] bg-white p-2 rounded-md">
                <span className="text-[#FF5733]">PDF</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
