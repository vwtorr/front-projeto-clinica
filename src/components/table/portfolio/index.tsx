import Link from "next/link";
import { format } from 'date-fns';
import { useState } from "react";

interface TableProps {
  data: any[];
  onDelete: (id: number) => Promise<void>;
}

export function TableExpenses({ data, onDelete }: TableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="max-w-full overflow-x-auto m-0 p-8 bg-gray-50 rounded-lg shadow-md">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="text-gray-500 border p-2" scope="col">Descrição</th>
              <th className="text-gray-500 border p-2" scope="col">N° do documento</th>
              <th className="text-gray-500 border p-2" scope="col">Data de lançamento</th>
              <th className="text-gray-500 border p-2" scope="col">Status do título</th>
              <th className="text-gray-500 border p-2" scope="col">Categoria</th>
              <th className="text-gray-500 border p-2" scope="col">Valor</th>
              <th className="text-gray-500 border p-2" scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td className="text-center py-4 text-gray-500" colSpan={7}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              paginatedData.map((item: any, i: number) => (
                <tr className={`${i % 2 === 0 ? "bg-white" : "bg-gray-100"}`} key={item?.id}>
                  <td className="text-center py-4">{item?.description || '-'}</td>
                  <td className="text-center py-4">{item?.document || '-'}</td>
                  <td className="text-center py-4">
                    {item?.releaseDate ? format(new Date(item.releaseDate), 'dd/MM/yyyy') : '-'}
                  </td>
                  <td className="text-center py-4">
                    <div className={`${item?.status === "Pago" ? 'bg-green-500' : 'bg-blue-500'} rounded-2xl px-4 py-2 text-white flex justify-center items-center gap-2`}>
                      <div className={`${item?.status === "Pago" ? 'bg-green-800' : 'bg-blue-800'} w-2 h-2 rounded-full`}></div>
                      {item?.status || '-'}
                    </div>
                  </td>
                  <td className="text-center py-4">{item?.type || '-'}</td>
                  <td className="text-center py-4 border-r">
                    {item?.value !== undefined && item?.value !== null && !isNaN(Number(item.value))
                      ? Number(item.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      : (0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>

                  <td className="text-center w-[5%] px-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-3">
                    {/* Botão de Visualizar */}
                    <div className="w-7 h-9 flex items-center cursor-pointer hover:text-blue-500">
                      <Link href={`/expense/${item?.id}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
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

                    {/* Botão de Pagar */}
                    <div className="w-5 h-5 cursor-pointer hover:text-green-500 mt-1">
                      <Link href={`/expense/${item?.id}`}>
                        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none"><path d="M2370 5114 c-19 -2 -78 -9 -130 -15 -791 -90 -1522 -586 -1924 -1305 -146 -262 -252 -588 -297 -914 -18 -125 -18 -515 0 -640 105 -762 511 -1409 1146 -1826 840 -552 1956 -550 2797 4 1266 835 1539 2571 591 3747 -409 507 -974 829 -1633 930 -100 15 -472 28 -550 19z m545 -343 c628 -106 1158 -448 1511 -977 179 -267 296 -573 351 -909 24 -153 24 -497 0 -650 -108 -668 -474 -1222 -1042 -1580 -243 -153 -537 -261 -850 -312 -154 -24 -497 -24 -650 1 -658 107 -1197 455 -1557 1006 -168 257 -281 557 -335 885 -24 153 -24 497 0 650 81 497 291 912 636 1255 382 381 862 605 1401 654 108 10 418 -4 535 -23z" /><path d="M2495 4146 c-74 -34 -95 -83 -95 -221 l0 -103 -67 -21 c-89 -27 -180 -82 -263 -158 -243 -225 -299 -597 -133 -883 21 -36 74 -101 118 -145 139 -139 270 -197 487 -214 109 -9 130 -14 194 -45 86 -43 144 -103 187 -194 29 -61 32 -76 32 -162 0 -86 -3 -101 -32 -162 -44 -93 -100 -151 -191 -196 -72 -35 -81 -37 -171 -37 -87 0 -102 3 -161 31 -142 68 -222 182 -239 343 -10 88 -24 117 -75 155 -20 16 -42 21 -86 21 -63 0 -95 -16 -133 -67 -59 -79 -12 -322 94 -484 81 -125 235 -244 371 -285 l66 -20 4 -119 c3 -128 11 -149 72 -194 39 -29 133 -29 172 0 61 45 69 66 72 192 l4 117 78 28 c302 107 499 408 477 728 -13 177 -81 323 -212 454 -139 139 -270 197 -487 214 -109 9 -130 14 -194 45 -86 43 -144 103 -187 194 -29 61 -32 76 -32 163 0 90 2 99 37 171 45 91 103 147 196 191 61 29 76 32 162 32 86 0 101 -3 162 -32 139 -66 220 -182 237 -342 10 -88 24 -117 75 -155 39 -29 133 -29 172 0 69 51 85 112 64 242 -43 266 -234 494 -482 574 l-66 21 -4 118 c-3 127 -11 148 -70 192 -34 25 -113 32 -153 13z" /></g></svg>
                      </Link>
                    </div>

                    {/* Botão de Deletar */}
                    <div
                      className="w-7 h-8 flex items-center justify-center cursor-pointer hover:text-red-500"
                      onClick={() => onDelete(item?.id)}
                    >
                      <svg
                        data-slot="icon"
                        aria-hidden="true"
                        fill="none"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </td>
                </tr>
              ))
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
    </div>
  );
}
