
import { useEffect } from 'react';
import clienteAxios from '../api/axios';


const ConsultasInstructor = (e) => {
    console.log(12)

    useEffect(() => {
        const fetchConsultas = async () => {
            try {
                const {data} = await clienteAxios.get('consultas/consultas-instructor');
                console.log(data); // aquí están los datos
            } catch (error) {
                console.error(error);
            }
        };

        fetchConsultas();
    }, []);
    return (
        <div>ConsultasInstructor</div>
    )
}

export default ConsultasInstructor