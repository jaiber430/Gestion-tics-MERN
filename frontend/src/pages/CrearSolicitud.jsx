import React from 'react'
import Header from '../components/Header'
import SolicitudRegular from '../components/Solicitudregular'
import SolicitudCampesena from '../components/SolicitudCampesena'
import { useParams } from 'react-router-dom'
const CrearSolicitud = () => {

    const params = useParams()

    return (
        <div>
            <Header />
            {params.tipo === 'regular' ? <SolicitudRegular /> : <SolicitudCampesena />}
        </div>
    )
}

export default CrearSolicitud
