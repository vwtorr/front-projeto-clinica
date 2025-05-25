
export default function Loading() {
  return (
    <section className="bg-black w-screen flex justify-center items-center h-screen top-0 left-0 bg-opacity-55  absolute z-20 ">
      <div className="w-auto h-[200px] items-center gap-8 bg-white flex justify-center  rounded-lg p-5">
        <div className="flex justify-center items-center">
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="20" stroke="blue" strokeWidth="4" fill="none" strokeLinecap="round"
              strokeDasharray="125" strokeDashoffset="0">
              <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25"
                dur="1s" repeatCount="indefinite" />
              <animate attributeName="stroke-dashoffset" from="125" to="0" dur="1s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
        <div className="text-2xl font-bold mb-5">
          Operação esta sendo efetuada assim que concluir, voce sera redirecionado a pagina de listagem!
        </div>

      </div>
    </section>
  );
}
