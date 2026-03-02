const Alerta = ({ alerta }) => {
    return (
        <div className="mt-6">
            {alerta.error ? (
                <p className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm font-medium text-center shadow-sm animate-fade-in">
                    {alerta.msg}
                </p>
            ) : (
                <p className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl text-sm font-medium text-center shadow-sm animate-fade-in">
                    {alerta.msg}
                </p>
            )}
        </div>
    )
}

export default Alerta
