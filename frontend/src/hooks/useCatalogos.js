// hooks/useCatalogos.js
import { useState, useEffect } from 'react'
import clienteAxios from '../../api/axios'

export const useCatalogos = (tipo) => {
    const [areas, setAreas] = useState([])
    const [programasFormacion, setProgramasFormacion] = useState([])
    const [programasEspeciales, setProgramasEspeciales] = useState([])
    const [municipios, setMunicipios] = useState([])
    const [loading, setLoading] = useState(false)

    // Cargar catálogos iniciales
    useEffect(() => {
        const cargarCatalogos = async () => {
            setLoading(true)
            try {
                const [areasRes, municipiosRes, especialesRes] = await Promise.all([
                    clienteAxios.get('/catalogos/areas'),
                    clienteAxios.get('/catalogos/municipios'),
                    clienteAxios.get(`/catalogos/programas-especiales?tipo=${tipo}`)
                ])

                setAreas(areasRes.data)
                setMunicipios(municipiosRes.data)
                setProgramasEspeciales(especialesRes.data)

            } catch (err) {
                console.error('Error cargando catálogos:', err)
            } finally {
                setLoading(false)
            }
        }

        cargarCatalogos()
    }, [tipo])

    // Cargar programas por área
    const cargarProgramasPorArea = async (areaId) => {
        if (!areaId) {
            setProgramasFormacion([])
            return
        }

        try {
            const { data } = await clienteAxios.get(
                `/catalogos/programas-formacion/${areaId}`
            )
            setProgramasFormacion(data)
        } catch (err) {
            console.error('Error cargando programas:', err)
        }
    }

    return {
        areas,
        programasFormacion,
        setProgramasFormacion,
        programasEspeciales,
        municipios,
        cargarProgramasPorArea,
        loading
    }
}
