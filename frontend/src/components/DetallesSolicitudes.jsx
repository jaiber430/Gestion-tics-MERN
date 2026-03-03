import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HeaderFuncionario from '../components/HeaderFuncionario';
import clienteAxios from '../api/axios';
import Alerta from '../components/Alerta'
import formatearMeses from '../helpers/formatearMeses';
import { formatearFechaInicio, formatearFechaFin } from '../helpers/formatearFechas'
import useAuth from '../hooks/useAuth';

// Componente reutilizable para cada fila de dato
const Fila = ({ label, value }) => (
    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-slate-50 transition-colors">
        <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center">{label}</dt>
        <dd className="mt-1 text-sm font-medium text-slate-800 sm:mt-0 sm:col-span-2">{value || '—'}</dd>
    </div>
)

// Card Regular — header naranja
const CardRegular = ({ titulo, icono, children }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-500 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                {icono}
            </div>
            <h3 className="text-base font-bold text-white tracking-wide">{titulo}</h3>
        </div>
        <div className="border-t border-slate-100">
            <dl className="divide-y divide-slate-100">
                {children}
            </dl>
        </div>
    </div>
)

// Card CampeSENA — header verde
const CardCampe = ({ titulo, icono, children }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-green-700 to-emerald-600 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                {icono}
            </div>
            <h3 className="text-base font-bold text-white tracking-wide">{titulo}</h3>
        </div>
        <div className="border-t border-slate-100">
            <dl className="divide-y divide-slate-100">
                {children}
            </dl>
        </div>
    </div>
)

const DetallesSolicitudes = () => {
    const params = useParams();
    const [solicitud, setSolicitud] = useState(null);
    const [alerta, setAlerta] = useState({});

    useEffect(() => {
        const obtenerSolicitudes = async () => {
            try {
                const [solicitudRes] = await Promise.all([
                    clienteAxios.get(`/consultas/solicitudes-funcionario/${params.id}`)
                ]);
                setSolicitud(solicitudRes.data);
            } catch (error) {
                setAlerta({
                    msg: error?.response?.data?.msg || 'Error al cargar la solicitud',
                    error: true
                });
                setTimeout(() => setAlerta({}), 3000);
            }
        };
        obtenerSolicitudes();
    }, [params.id]);

    console.log(solicitud)

    // Loading
    if (!solicitud) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
                <HeaderFuncionario />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            </div>
        );
    }

    const solicitudData = Array.isArray(solicitud) ? solicitud[0] : solicitud;
    const tipoSolicitud = solicitudData?.solicitud?.tipoSolicitud;
    const s = solicitudData?.solicitud

    // Datos del usuario solicitante
    const usuario = solicitudData?.usuarioSolicitante || {};
    const coordinador = solicitudData?.usuarioRevisador || {}

    // Formatear meses
    const mesesFormateados = formatearMeses(s?.meses);

    // Card dinámica según tipo
    const Card = tipoSolicitud === 'CampeSENA' ? CardCampe : CardRegular

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
            <HeaderFuncionario />

            {alerta.msg && <Alerta alerta={alerta} />}

            <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

                {/* Encabezado de página */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow bg-gradient-to-br
                                ${tipoSolicitud === 'CampeSENA' ? 'from-green-600 to-emerald-500' : 'from-orange-500 to-amber-400'}`}>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Detalles de la Solicitud</h1>
                                <p className="text-sm text-slate-500">
                                    Tipo: <span className={`font-semibold ${tipoSolicitud === 'CampeSENA' ? 'text-green-700' : 'text-orange-600'}`}>{tipoSolicitud}</span>
                                    {s?.tipoOferta && <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{s.tipoOferta}</span>}
                                    {s?.tipoInstructor && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold">{s.tipoInstructor}</span>}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================================ */}
                {/* SOLICITUD REGULAR                */}
                {/* ================================ */}
                {tipoSolicitud === 'Regular' ? (
                    <div className="space-y-6">

                        {/* Card: Solicitante */}
                        <Card titulo="Información del Solicitante" icono={
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }>
                            <Fila label="Nombre completo" value={`${usuario.nombre || ''} ${usuario.apellido || ''}`} />
                            <Fila label="Email" value={usuario.email} />
                            <Fila label="Celular" value={usuario.celular} />
                        </Card>

                        {/* Card: Programa de Formación */}
                        <Card titulo="Programa de Formación" icono={
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        }>
                            <Fila label="Nombre del programa" value={s?.programaFormacion?.nombrePrograma} />
                            <Fila label="Código del programa" value={s?.programaFormacion?.codigoPrograma} />
                            <Fila label="Versión" value={s?.programaFormacion?.versionPrograma} />
                            <Fila label="Área" value={s?.programaFormacion?.area?.area} />
                            <Fila label="Horas" value={s?.programaFormacion?.horas} />
                            <Fila label="Programa especial" value={s?.programaEspecial?.programaEspecial} />
                            <Fila label="Cupo" value={s?.cupo} />
                            <Fila label="Tipo de oferta" value={s?.tipoOferta} />
                        </Card>

                        {/* Card: Empresa */}
                        <Card titulo="Información de la Empresa" icono={
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        }>
                            <Fila label="Convenio" value={s?.convenio} />
                            <Fila label="Nombre de la empresa" value={s?.empresaSolicitante?.nombreEmpresa} />
                            <Fila label="NIT" value={s?.empresaSolicitante?.nitEmpresa} />
                            <Fila label="Fecha de creación" value={s?.empresaSolicitante?.fechaCreacion ? formatearFechaInicio(s?.empresaSolicitante?.fechaCreacion) : ''} />
                            <Fila label="Tipo de empresa" value={s?.empresaSolicitante?.tipoEmpresa?.tipoEmpresaRegular} />
                            <Fila label="Dirección" value={s?.empresaSolicitante?.direccionEmpresa} />
                            <Fila label="Representante" value={s?.empresaSolicitante?.nombreResponsable} />
                            <Fila label="Contacto" value={s?.empresaSolicitante?.nombreContactoEmpresa} />
                            <Fila label="Teléfono" value={s?.empresaSolicitante?.telefonoEmpresa} />
                            <Fila label="Email empresa" value={s?.empresaSolicitante?.emailEmpresa} />
                            <Fila label="Número de empleados" value={s?.empresaSolicitante?.numeroEmpleadosEmpresa} />
                        </Card>

                        {/* Card: Datos del Curso */}
                        <Card titulo="Datos del Curso" icono={
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        }>
                            <Fila label="Municipio" value={s?.municipio?.municipios?.toUpperCase()} />
                            <Fila label="Departamento" value={s?.departamento} />
                            <Fila label="Dirección de formación" value={s?.direccionFormacion} />
                            <Fila label="Ambiente" value={s?.ambiente} />
                            <Fila label="Sub sector económico" value={s?.subSectorEconomico} />
                            <Fila label="Fecha de inicio" value={formatearFechaInicio(s?.fechaInicio)} />
                            <Fila label="Fecha de fin" value={formatearFechaFin(s?.fechaFin)} />
                            <Fila label="Horario" value={s?.horaInicio && s?.horaFin ? `${s.horaInicio} — ${s.horaFin}` : null} />

                            {/* Meses de formación */}
                            {mesesFormateados?.length > 0 && (
                                <div className="px-4 py-4 sm:px-6">
                                    <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Fechas de formación</dt>
                                    <dd className="space-y-2">
                                        {mesesFormateados.map((mes, index) => (
                                            <div key={index} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide mb-1">
                                                    {index === 0 ? 'Mes 1' : 'Mes 2'}
                                                </p>
                                                <p className="text-sm text-slate-700">
                                                    {mes.diasFormateados} DE {mes.nombreMes} DE {new Date().getFullYear()} DE {mes.horaInicio} A {mes.horaFin}
                                                </p>
                                            </div>
                                        ))}
                                    </dd>
                                </div>
                            )}
                        </Card>

                        {/* Card: Coordinador */}
                        <Card titulo="Información del Coordinador" icono={
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }>
                            <Fila label="Nombre" value={coordinador?.nombre ? `${coordinador.nombre} ${coordinador.apellido || ''}` : null} />
                            <Fila label="Email" value={coordinador?.email} />
                            <Fila label="Fecha revisión" value={formatearFechaInicio(solicitudData?.createdAt)} />
                        </Card>

                        {/* Card: Ficha */}
                        <Card titulo="Funcionario que crea la ficha en Sofia Plus" icono={
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        }>
                            <Fila label="Funcionario revisador" value={solicitudData?.ficha?.usuarioFuncionario?.nombre + ' ' + solicitudData?.ficha?.usuarioFuncionario?.apellido} />
                            <Fila label="Correo funcionario" value={solicitudData?.ficha?.usuarioFuncionario?.email} />
                            <Fila label="Fecha de revisión" value={solicitudData?.ficha?.createdAt ? formatearFechaInicio(solicitudData.ficha.createdAt) : '—'} />
                            <Fila label="Observación" value={solicitudData?.ficha?.observacionCreacion} />
                        </Card>

                    </div>

                ) : tipoSolicitud === 'CampeSENA' ? (

                    /* ================================ */
                    /* SOLICITUD CAMPE SENA             */
                    /* ================================ */
                    <div className="space-y-6">

                        {/* Card: Instructor */}
                        <Card titulo={`Datos del Instructor — ${s?.tipoInstructor || ''}`} icono={
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }>
                            <Fila label="Nombre completo" value={`${usuario.nombre || ''} ${usuario.apellido || ''}`} />
                            <Fila label="Email" value={usuario.email} />
                            <Fila label="Celular" value={usuario.celular} />
                        </Card>

                        {/* Card: Programa de Formación */}
                        <Card titulo="Programa de Formación" icono={
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        }>
                            <Fila label="Nombre del programa" value={s?.programaFormacion?.nombrePrograma} />
                            <Fila label="Código del programa" value={s?.programaFormacion?.codigoPrograma} />
                            <Fila label="Versión" value={s?.programaFormacion?.versionPrograma} />
                            <Fila label="Área" value={s?.programaFormacion?.area?.area} />
                            <Fila label="Horas" value={s?.programaFormacion?.horas} />
                            <Fila label="Programa especial" value={s?.programaEspecial?.programaEspecial} />
                            <Fila label="Cupo" value={s?.cupo} />
                            <Fila label="Tipo de oferta" value={s?.tipoOferta} />
                        </Card>

                        {/* Card: Empresa — solo si tiene empresa */}
                        {s?.empresaSolicitante && (
                            <Card titulo="Información de la Empresa" icono={
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            }>
                                <Fila label="Nombre de la empresa" value={s?.empresaSolicitante?.nombreEmpresa} />
                                <Fila label="NIT" value={s?.empresaSolicitante?.nitEmpresa} />
                                <Fila label="Fecha de creación" value={s?.empresaSolicitante?.fechaCreacion ? formatearFechaInicio(s?.empresaSolicitante?.fechaCreacion) : ''} />
                                <Fila label="Tipo de empresa" value={s?.empresaSolicitante?.tipoEmpresa?.tipoEmpresaRegular} />
                                <Fila label="Dirección" value={s?.empresaSolicitante?.direccionEmpresa} />
                                <Fila label="Representante" value={s?.empresaSolicitante?.nombreResponsable} />
                                <Fila label="Contacto" value={s?.empresaSolicitante?.nombreContactoEmpresa} />
                                <Fila label="Teléfono" value={s?.empresaSolicitante?.telefonoEmpresa} />
                                <Fila label="Email empresa" value={s?.empresaSolicitante?.emailEmpresa} />
                                <Fila label="Número de empleados" value={s?.empresaSolicitante?.numeroEmpleadosEmpresa} />
                            </Card>
                        )}

                        {/* Card: Datos de Ejecución */}
                        <Card titulo="Datos de Ejecución" icono={
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        }>
                            <Fila label="Municipio" value={s?.municipio?.municipios?.toUpperCase()} />
                            <Fila label="Departamento" value={s?.departamento} />
                            <Fila label="Dirección de formación" value={s?.direccionFormacion} />
                            <Fila label="Ambiente" value={s?.ambiente} />
                            <Fila label="Fecha de inicio" value={formatearFechaInicio(s?.fechaInicio)} />
                            <Fila label="Fecha de fin" value={formatearFechaFin(s?.fechaFin)} />

                            {/* Fechas por mes — hasta 5 meses */}
                            {mesesFormateados?.length > 0 && (
                                <div className="px-4 py-4 sm:px-6">
                                    <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Fechas de ejecución por mes</dt>
                                    <dd className="space-y-2">
                                        {mesesFormateados.map((mes, index) => (
                                            <div key={index} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">
                                                    Mes {index + 1}
                                                </p>
                                                <p className="text-sm text-slate-700">
                                                    {mes.diasFormateados} DE {mes.nombreMes} DE {new Date().getFullYear()} DE {mes.horaInicio} A {mes.horaFin}
                                                </p>
                                            </div>
                                        ))}
                                    </dd>
                                </div>
                            )}
                        </Card>

                        {/* Card: Coordinador */}
                        <Card titulo="Información del Coordinador" icono={
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }>
                            <Fila label="Nombre" value={coordinador?.nombre ? `${coordinador.nombre} ${coordinador.apellido || ''}` : null} />
                            <Fila label="Email" value={coordinador?.email} />
                            <Fila label="Fecha revisión" value={formatearFechaInicio(solicitudData?.createdAt)} />
                        </Card>

                        {/* Card: Ficha */}
                        <Card titulo="Funcionario que crea la ficha en Sofia Plus" icono={
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        }>
                            <Fila
                                label="Funcionario revisador"
                                value={solicitudData?.ficha?.usuarioFuncionario ?
                                    `${solicitudData.ficha.usuarioFuncionario.nombre || ''} ${solicitudData.ficha.usuarioFuncionario.apellido || ''}`.trim() || '---'
                                    : '---'}
                            />
                            <Fila label="Correo funcionario" value={solicitudData?.ficha?.usuarioFuncionario?.email} />
                            <Fila label="Fecha de revisión" value={solicitudData?.ficha?.createdAt ? formatearFechaInicio(solicitudData.ficha.createdAt) : '—'} />
                            <Fila label="Observación" value={solicitudData?.ficha?.observacionCreacion} />
                        </Card>

                    </div>

                ) : (
                    /* Tipo no reconocido */
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                            <svg className="h-5 w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-amber-800">Tipo de solicitud no implementado</p>
                            <p className="text-sm text-amber-600 mt-1">Este tipo de solicitud aún no tiene vista de detalles disponible.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetallesSolicitudes;
