import Link from "next/link";
import { useState } from "react";

interface TableProps {
  data: any;
  isSuccessOpen?: boolean;
  onCloseSuccess?: () => void;
}


export function TableServices({ data }: TableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="max-w-full overflow-x-auto m-0 p-8 bg-gray-50 rounded-lg shadow-md">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="text-gray-500 border p-2" scope="col">Código</th>
            <th className="text-gray-500 border p-2" scope="col">Nome</th>
            <th className="text-gray-500 border p-2" scope="col">Descrição</th>
            <th className="text-gray-500 border p-2" scope="col">Status</th>
            <th className="text-gray-500 border p-2" scope="col">Valor</th>
            <th className="text-gray-500 border p-2" scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((item: any) => (
              <tr
                key={item.id}
                className="cursor-pointer hover:bg-gray-100 border-b border-gray-300"
              >
                <td className="text-center py-4">{item?.code}</td>
                <td className="text-center py-4">
                  {item?.name
                    ? item.name.trim().length > 15
                      ? item.name.trim().slice(0, 15) + '...'
                      : item.name.trim()
                    : '-'}
                </td>
                <td className="text-center py-4">
                  {item?.description
                    ? item.description.trim().length > 20
                      ? item.description.trim().slice(0, 20) + '...'
                      : item.description.trim()
                    : '-'}
                </td>
                <td className="text-center py-4">
                  <div
                    className={`${item?.status ? "bg-green-400" : "bg-red-400"
                      } rounded-2xl px-4 py-2 text-white flex justify-center items-center gap-4`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${item?.status ? "bg-green-800" : "bg-red-800"
                        }`}
                    ></div>
                    {item?.status ? "Ativo" : "Desativado"}
                  </div>
                </td>
                <td className="text-center py-4 border-r">
                  {!isNaN(Number(item?.price))
                    ? Number(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : (0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  }
                </td>

                <td
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-center gap-2">
                    <div className="w-9 h-9 flex items-center cursor-pointer hover:text-blue-500">
                      <Link href={`/service/${item?.id}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 128 128"
                          fill="currentColor"
                        >
                          <g transform="translate(0,128) scale(0.1,-0.1)">
                            <path d="M531 1035 c-141 -32 -291 -124 -426 -261-100 -102-114-124-94-160 22-42 167-185 240-236 122-87 281-148 389-148 107 0 269 61 384 145 115 83 256 229 256 265 0 24-108 147-184 210-194 160-391 225-565 185z m257-101 c99-33 219-112 315-208 42-43 77-82 77-87 0-20-160-166-236-215-211-138-401-138-609 1-77 51-235 195-235 215 0 14 119 130 186 182 171 132 335 168 502 112z" />
                            <path d="M550 877 c-49 -16-133 -102-148 -153-30 -101-9-188 63-259 71-72 158-93 259-63 55 16 138 99 154 154 30 101 9 188-63 259-71 71-166 93-265 62z m153-81 c113-47 139-197 48-279-71-64-170-59-234 12-60 67-62 152-4 218 53 60 122 78 190 49z" />
                          </g>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>
                <div className="flex justify-center items-center py-4 text-gray-500">
                  Nenhum registro encontrado.
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginação */}
      {data.length > 0 && (
        <div className="flex justify-end mt-4">
          <nav aria-label="Navegação de páginas">
            <ul className="flex border border-gray-400 rounded overflow-hidden">
              <li>
                <button
                  className="px-3 py-1 bg-gray-200 text-black hover:bg-gray-300 transition"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i}>
                  <button
                    className={`px-3 py-1 ${currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                      } transition`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li>
                <button
                  className="px-3 py-1 bg-gray-200 text-black hover:bg-gray-300 transition"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
