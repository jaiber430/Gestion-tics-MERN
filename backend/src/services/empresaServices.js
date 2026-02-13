// const crearSolicitudCerrada = async () => {
//     if (!tipoOferta || !cupo || !direccionFormacion || !subSectorEconomico || !convenio || !ambiente || !nombreEmpresa || !nombreResponsable || !emailEmpresa || !nitEmpresa || !tipoEmpresa || !cartaSolicitud || !programaFormacion || !programaEspecial || !municipio || !fechaInicio || !mes1 || !mes2 || !horaInicio || !horaFin || !fechasSeleccionadas) {
//         throw new HttpErrors('Todos los campos son requeridos', 400)
//     }

//     // Verificaciones adicionales para la creación
//     const { programaExiste, existeProgramaEspecial, existeMunicipio } = solicitudVerificacion(req.body)
//     const { existeTipoEmpresa } = empresaValidator(req.body)

//     const crearEmpresa = await Empresa.create([{
//         nombreEmpresa: nombreEmpresa,
//         nombreResponsable: nombreResponsable,
//         emailEmpresa: emailEmpresa,
//         nitEmpresa: nitEmpresa,
//         tipoEmpresa: existeTipoEmpresa._id,
//         cartaSolicitud: cartaSolicitud
//     }], { session })

//     // Verificaciones y Creación del horario

//     const horario = construirHorario(programaExiste, req.body);

//     const nuevaSolicitud = await Solicitud.create({
//         tipoSolicitud: tipoSolicitud,
//         tipoOferta: tipoOferta,
//         cupo: cupo,
//         direccionFormacion: direccionFormacion,
//         subSectorEconomico: subSectorEconomico,
//         convenio: convenio,
//         ambiente: ambiente,
//         usuarioSolicitante: req.usuario.id,
//         empresaSolicitante: crearEmpresa[0]._id,
//         municipio: existeMunicipio,
//         programaFormacion: programaExiste,
//         programaEspecial: existeProgramaEspecial,
//         fechaInicio: horario.fechaInicio,
//         fechaFin: horario.fechaFin,
//         mes1: horario.mes1,
//         mes2: horario.mes2,
//         horaInicio: horario.horaInicio,
//         horaFin: horario.horaFin,
//         fechasSeleccionadas: horario.fechasSeleccionadas
//     }, { session });

//     await session.commitTransaction()
//     session.endSession()

// }
