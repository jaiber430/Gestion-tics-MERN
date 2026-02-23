import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import clienteAxios from '../api/axios'; 

const Preinscripcion = () => {
  const { id } = useParams();
  const [tiposDoc, setTiposDoc] = useState([]);
  const [enfocado, setEnfocado] = useState(""); 
  
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    tipoIdentificacion: "", 
    numeroIdentificacion: "",
    telefono: "",
    email: "",
    pdf: null 
  });

  // 1. Cargar tipos de identificación
  useEffect(() => {
    const obtenerTipos = async () => {
      try {
        const { data } = await clienteAxios.get('/aspirantes/tipos'); 
        setTiposDoc(data);
      } catch (error) {
        console.error("Error al cargar tipos", error);
      }
    };
    obtenerTipos();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    try {
      await clienteAxios.post(`/aspirantes/preincripcion-aspirantes/${id}`, formData);
      alert("¡Registro exitoso!");
    } catch (error) {
      alert(error.response?.data?.msg || "Error al registrar");
    }
  };

  // --- OBJETOS DE ESTILO CON TODAS LAS ANIMACIONES ---
  const estilos = {
    contenedor: {
      maxWidth: '450px',
      margin: '50px auto',
      padding: '40px',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
      fontFamily: '"Inter", sans-serif',
    },
    grupo: {
      position: 'relative',
      marginBottom: '25px',
    },
    label: (name) => {
      // Condición para que la etiqueta suba si hay texto o está el cursor dentro
      const estaActivo = enfocado === name || (form[name] && form[name] !== "");
      return {
        position: 'absolute',
        left: '12px',
        top: estaActivo ? '-12px' : '14px',
        fontSize: estaActivo ? '12px' : '16px',
        backgroundColor: estaActivo ? '#ffffff' : 'transparent',
        padding: '0 6px',
        color: estaActivo ? '#3182ce' : '#94a3b8',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none',
        zIndex: 10,
        fontWeight: estaActivo ? '600' : '400',
      };
    },
    input: (name) => ({
      width: '100%',
      padding: '14px',
      fontSize: '16px',
      border: enfocado === name ? '2px solid #3182ce' : '1px solid #cbd5e0',
      borderRadius: '12px',
      outline: 'none',
      boxSizing: 'border-box',
      backgroundColor: 'transparent',
      // Animación de escala y brillo
      transform: enfocado === name ? 'scale(1.02)' : 'scale(1)',
      boxShadow: enfocado === name ? '0 10px 15px -3px rgba(49, 130, 206, 0.15)' : 'none',
      transition: 'all 0.3s ease',
    }),
    boton: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#3182ce',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(49, 130, 206, 0.2)',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={estilos.contenedor}>
      <h2 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '35px', fontWeight: '800' }}>
        Inscripción de Aspirante
      </h2>
      
      <form onSubmit={handleSubmit}>
        
        {/* Campo Nombre */}
        <div style={estilos.grupo}>
          <label style={estilos.label("nombre")}>Nombre</label>
          <input
            style={estilos.input("nombre")}
            name="nombre"
            value={form.nombre}
            onFocus={() => setEnfocado("nombre")}
            onBlur={() => setEnfocado("")}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo Apellido */}
        <div style={estilos.grupo}>
          <label style={estilos.label("apellido")}>Apellido</label>
          <input
            style={estilos.input("apellido")}
            name="apellido"
            value={form.apellido}
            onFocus={() => setEnfocado("apellido")}
            onBlur={() => setEnfocado("")}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo Select con Animación */}
        <div style={estilos.grupo}>
          <label style={estilos.label("tipoIdentificacion")}>Tipo de Documento</label>
          <select 
            style={estilos.input("tipoIdentificacion")} 
            name="tipoIdentificacion"
            onFocus={() => setEnfocado("tipoIdentificacion")}
            onBlur={() => setEnfocado("")}
            onChange={handleChange}
            value={form.tipoIdentificacion}
            required
          >
            <option value="" disabled hidden></option>
            {tiposDoc.map(t => (
              <option key={t._id} value={t._id} style={{color: '#333'}}>
                {t.nombreTipoIdentificacion}
              </option>
            ))}
          </select>
        </div>

        {/* Campo Número */}
        <div style={estilos.grupo}>
          <label style={estilos.label("numeroIdentificacion")}>Número de Documento</label>
          <input
            style={estilos.input("numeroIdentificacion")}
            name="numeroIdentificacion"
            value={form.numeroIdentificacion}
            onFocus={() => setEnfocado("numeroIdentificacion")}
            onBlur={() => setEnfocado("")}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo Teléfono */}
        <div style={estilos.grupo}>
          <label style={estilos.label("telefono")}>Teléfono</label>
          <input
            style={estilos.input("telefono")}
            name="telefono"
            value={form.telefono}
            onFocus={() => setEnfocado("telefono")}
            onBlur={() => setEnfocado("")}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo Email */}
        <div style={estilos.grupo}>
          <label style={estilos.label("email")}>Email</label>
          <input
            style={estilos.input("email")}
            name="email"
            type="email"
            value={form.email}
            onFocus={() => setEnfocado("email")}
            onBlur={() => setEnfocado("")}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo PDF */}
        <div style={{ ...estilos.grupo, border: '2px dashed #cbd5e0', padding: '15px', borderRadius: '12px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
          <label style={{ fontSize: '14px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Adjuntar Documento PDF
          </label>
          <input type="file" name="pdf" accept="application/pdf" onChange={handleChange} required />
        </div>

        <button 
          type="submit" 
          style={estilos.boton}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#2563eb';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#3182ce';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Finalizar Inscripción
        </button>
      </form>
    </div>
  );
};

export default Preinscripcion;


// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import clienteAxios from '../api/axios'; 

// const Preinscripcion = () => {
//   const { id } = useParams();
//   const [tiposDoc, setTiposDoc] = useState([]);
//   const [enfocado, setEnfocado] = useState(""); 
  
//   const [form, setForm] = useState({
//     nombre: "",
//     apellido: "",
//     tipoIdentificacion: "", 
//     numeroIdentificacion: "",
//     telefono: "",
//     email: "",
//     pdf: null 
//   });

//   // 1. Cargar tipos de identificación
//   useEffect(() => {
//     const obtenerTipos = async () => {
//       try {
//         const { data } = await clienteAxios.get('/aspirantes/tipos'); 
//         setTiposDoc(data);
//       } catch (error) {
//         console.error("Error al cargar tipos", error);
//       }
//     };
//     obtenerTipos();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setForm({ ...form, [name]: files ? files[0] : value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.keys(form).forEach(key => formData.append(key, form[key]));
//     try {
//       await clienteAxios.post(`/aspirantes/preincripcion-aspirantes/${id}`, formData);
//       alert("¡Registro exitoso!");
//     } catch (error) {
//       alert(error.response?.data?.msg || "Error al registrar");
//     }
//   };

//   // --- OBJETOS DE ESTILO ---
//   const estilos = {
//     contenedor: {
//       maxWidth: '450px',
//       margin: '50px auto',
//       padding: '40px',
//       backgroundColor: '#ffffff',
//       borderRadius: '20px',
//       boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
//       fontFamily: 'sans-serif',
//     },
//     grupo: {
//       position: 'relative',
//       marginBottom: '25px', // Espacio entre campos
//     },
//     // AQUÍ ESTÁ LA ANIMACIÓN:
//     label: (name) => {
//       const estaActivo = enfocado === name || form[name] !== "";
//       return {
//         position: 'absolute',
//         left: '12px',
//         top: estaActivo ? '-12px' : '12px', // Sube o baja
//         fontSize: estaActivo ? '12px' : '16px', // Se hace pequeña o grande
//         backgroundColor: estaActivo ? '#ffffff' : 'transparent',
//         padding: '0 4px',
//         color: estaActivo ? '#3182ce' : '#94a3b8',
//         transition: 'all 0.2s ease', // Duración de la animación
//         pointerEvents: 'none',
//         zIndex: 1,
//       };
//     },
//     input: (name) => ({
//       width: '100%',
//       padding: '12px',
//       fontSize: '16px',
//       border: enfocado === name ? '2px solid #3182ce' : '1px solid #cbd5e0',
//       borderRadius: '8px',
//       outline: 'none',
//       boxSizing: 'border-box',
//       transition: 'border-color 0.2s',
//     }),
//     boton: {
//       width: '100%',
//       padding: '14px',
//       backgroundColor: '#3182ce',
//       color: 'white',
//       border: 'none',
//       borderRadius: '8px',
//       fontSize: '16px',
//       fontWeight: 'bold',
//       cursor: 'pointer',
//       transition: 'background 0.3s'
//     }
//   };

//   return (
//     <div style={estilos.contenedor}>
//       <h2 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '30px' }}>Inscripción de Aspirante</h2>
      
//       <form onSubmit={handleSubmit}>
        
//         {/* Campo Nombre */}
//         <div style={estilos.grupo}>
//           <label style={estilos.label("nombre")}>Nombre</label>
//           <input
//             style={estilos.input("nombre")}
//             name="nombre"
//             value={form.nombre}
//             onFocus={() => setEnfocado("nombre")}
//             onBlur={() => setEnfocado("")}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         {/* Campo Apellido */}
//         <div style={estilos.grupo}>
//           <label style={estilos.label("apellido")}>Apellido</label>
//           <input
//             style={estilos.input("apellido")}
//             name="apellido"
//             value={form.apellido}
//             onFocus={() => setEnfocado("apellido")}
//             onBlur={() => setEnfocado("")}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         {/* Campo Select */}
//         {/* <div style={estilos.grupo}>
//           <label style={estilos.label("tipoIdentificacion")}>Tipo de Documento</label>
//           <select 
//             style={estilos.input("tipoIdentificacion")} 
//             name="tipoIdentificacion"
//             onFocus={() => setEnfocado("tipoIdentificacion")}
//             onBlur={() => setEnfocado("")}
//             onChange={handleChange}
//             value={form.tipoIdentificacion}
//             required
//           >
//             <option value=""></option>
//             {tiposDoc.map(t => (
//               <option key={t._id} value={t._id}>{t.nombreTipoIdentificacion}</option>
//             ))}
//           </select>
//         </div> */}

//         <div style={estilos.grupo}>
//           {/* La etiqueta ahora reaccionará correctamente al estado del form */}
//           <label style={estilos.label("tipoIdentificacion")}>
//             Tipo de Documento
//           </label>
          
//           <select 
//             style={estilos.input("tipoIdentificacion")} 
//             name="tipoIdentificacion"
//             onFocus={() => setEnfocado("tipoIdentificacion")}
//             onBlur={() => setEnfocado("")}
//             onChange={handleChange}
//             value={form.tipoIdentificacion}
//             required
//           >
//             <option value="" disabled hidden></option> {/* Opción invisible para el estado inicial */}
//             {tiposDoc.map(t => (
//               <option key={t._id} value={t._id} style={{color: '#333'}}>
//                 {t.nombreTipoIdentificacion}
//               </option>
//             ))}
//           </select>
//         </div>


//         {/* Campo Número */}
//         <div style={estilos.grupo}>
//           <label style={estilos.label("numeroIdentificacion")}>Número de Documento</label>
//           <input
//             style={estilos.input("numeroIdentificacion")}
//             name="numeroIdentificacion"
//             value={form.numeroIdentificacion}
//             onFocus={() => setEnfocado("numeroIdentificacion")}
//             onBlur={() => setEnfocado("")}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         {/* Campo Teléfono */}
//         <div style={estilos.grupo}>
//           <label style={estilos.label("telefono")}>Teléfono</label>
//           <input
//             style={estilos.input("telefono")}
//             name="telefono"
//             value={form.telefono}
//             onFocus={() => setEnfocado("telefono")}
//             onBlur={() => setEnfocado("")}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         {/* Campo Email */}
//         <div style={estilos.grupo}>
//           <label style={estilos.label("email")}>Email</label>
//           <input
//             style={estilos.input("email")}
//             name="email"
//             type="email"
//             value={form.email}
//             onFocus={() => setEnfocado("email")}
//             onBlur={() => setEnfocado("")}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         {/* Campo PDF */}
//         <div style={{ ...estilos.grupo, border: '1px dashed #cbd5e0', padding: '10px', borderRadius: '8px' }}>
//           <label style={{ fontSize: '14px', color: '#64748b', display: 'block', marginBottom: '5px' }}>Documento PDF</label>
//           <input type="file" name="pdf" accept="application/pdf" onChange={handleChange} required />
//         </div>

//         <button 
//           type="submit" 
//           style={estilos.boton}
//           onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
//           onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
//         >
//           Inscribirme
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Preinscripcion;


// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import clienteAxios from '../api/axios'; 

// const Preinscripcion = () => {
//   const { id } = useParams();
//   const [tiposDoc, setTiposDoc] = useState([]);
//   const [form, setForm] = useState({
//     nombre: "",
//     apellido: "",
//     tipoIdentificacion: "", 
//     numeroIdentificacion: "",
//     telefono: "",
//     email: "",
//     pdf: null 
//   });

//   // 1. Cargar tipos de identificación
//   useEffect(() => {
//     const obtenerTipos = async () => {
//       try {
//         const { data } = await clienteAxios.get('/aspirantes/tipos'); 
//         setTiposDoc(data);
//       } catch (error) {
//         console.error("Error al cargar tipos de documento", error);
//       }
//     };
//     obtenerTipos();
//   }, []);

//   // 2. LA FUNCIÓN QUE TE FALTABA (Asegúrate de que esté aquí dentro)
//   const handleChange = (e) => {
//     if (e.target.name === "pdf") {
//       setForm({ ...form, pdf: e.target.files[0] });
//     } else {
//       setForm({ ...form, [e.target.name]: e.target.value });
//     }
//   };

//   // 3. Enviar el formulario
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
    
//     // Agregamos cada campo al FormData
//     formData.append("nombre", form.nombre);
//     formData.append("apellido", form.apellido);
//     formData.append("tipoIdentificacion", form.tipoIdentificacion);
//     formData.append("numeroIdentificacion", form.numeroIdentificacion);
//     formData.append("telefono", form.telefono);
//     formData.append("email", form.email);
//     formData.append("pdf", form.pdf);

//     try {
//       await clienteAxios.post(`/aspirantes/preincripcion-aspirantes/${id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       alert("¡Registro exitoso!");
//     } catch (error) {
//       alert(error.response?.data?.msg || "Error al registrar");
//     }
//   };

//   return (
//     <div className="container-preinscripcion">
//       <h2>Formulario de Registro</h2>
//       <form onSubmit={handleSubmit} className="form-preinscripcion">
//         <input
//           className="input-field"
//           name="nombre"
//           placeholder="Nombre"
//           onChange={handleChange}
//           required
//         />

//         <input
//           className="input-field"
//           name="apellido"
//           placeholder="Apellido"
//           onChange={handleChange}
//           required
//         />
        
//         <select 
//           className="input-field" 
//           name="tipoIdentificacion" 
//           onChange={handleChange} 
//           value={form.tipoIdentificacion}
//           required
//         >
//           <option value="">Seleccione Tipo de Documento</option>
//           {tiposDoc.map((tipo) => (
//             <option key={tipo._id} value={tipo._id}>
//               {tipo.nombreTipoIdentificacion}
//             </option>
//           ))}
//         </select>

//         <input
//           className="input-field"
//           name="numeroIdentificacion"
//           placeholder="Número de Documento"
//           onChange={handleChange}
//           required
//         />

//         <input
//           className="input-field"
//           name="telefono"
//           placeholder="Teléfono"
//           onChange={handleChange}
//           required
//         />
        
//         <input
//           className="input-field"
//           name="email"
//           type="email"
//           placeholder="Correo Electrónico"
//           onChange={handleChange}
//           required
//         />

//         <div className="file-section">
//             <label>Adjuntar Documento Identidad (PDF):</label>
//             <input
//               type="file"
//               name="pdf"
//               accept="application/pdf"
//               onChange={handleChange}
//               required
//             />
            
//         </div>

//         <button type="submit" className="btn-submit">Inscribirme</button>
//       </form>
//     </div>
//   );
// };

// export default Preinscripcion;