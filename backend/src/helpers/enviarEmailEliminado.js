import sgMail from "@sendgrid/mail";
import 'dotenv/config'

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailEliminado = async ({ email, nombre, apellido, motivo, emailInstructor, nombreInstructor, apellidoInstructor, programaFormacion }) => {
    try {
        await sgMail.send({
            to: email,
            from: "jaiberworks4302@gmail.com",
            subject: "Notificación de eliminación de preinscripción - SENA",
            html: `
                <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">

                    <!-- Header institucional -->
                    <div style="background-color: #003366; padding: 25px 20px; text-align: center; border-bottom: 4px solid #f7941e;">
                        <img src="https://sciudadanos.sena.edu.co/Resources/logoSena.png" alt="Logo SENA" style="height: 65px; display: block; margin: 0 auto;">
                        <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; font-weight: 300;">Servicio Nacional de Aprendizaje</p>
                    </div>

                    <!-- Contenido principal -->
                    <div style="padding: 40px 35px;">
                        <!-- Fecha y referencia -->
                        <div style="color: #6c757d; font-size: 13px; margin-bottom: 30px; text-align: right; border-bottom: 1px solid #e9ecef; padding-bottom: 15px;">
                            <span>REF: NOT-${Date.now().toString().slice(-6)}</span>
                        </div>

                        <!-- Saludo formal -->
                        <p style="color: #1a2b3c; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            Estimado/a <strong style="color: #003366;">${nombre} ${apellido}</strong>:
                        </p>

                        <!-- Cuerpo del mensaje -->
                        <p style="color: #2c3e50; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                            Por medio del presente, nos permitimos informarle que su preinscripción al programa de formación:
                        </p>

                        <!-- Programa destacado -->
                        <div style="background-color: #f8f9fa; padding: 18px 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #f7941e;">
                            <p style="margin: 0; font-size: 18px; font-weight: 600; color: #003366;">
                                ${programaFormacion}
                            </p>
                        </div>

                        <!-- Motivo de eliminación -->
                        <p style="color: #2c3e50; font-size: 15px; line-height: 1.6; margin-bottom: 10px;">
                            Ha sido <strong style="color: #b22222;">eliminada del sistema</strong> por la siguiente razón:
                        </p>

                        <div style="background-color: #fdf1f1; border: 1px solid #ffcdd2; border-radius: 6px; padding: 18px 20px; margin: 20px 0 30px 0;">
                            <p style="margin: 0 0 5px 0; font-size: 13px; color: #b22222; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                                Motivo de la eliminación
                            </p>
                            <p style="margin: 0; font-size: 15px; color: #1a2b3c; line-height: 1.5;">
                                "${motivo}"
                            </p>
                        </div>

                        <!-- Instrucciones -->
                        <div style="margin-top: 30px;">
                            <p style="color: #2c3e50; font-size: 15px; line-height: 1.6; margin-bottom: 15px;">
                                Si considera que esta decisión no corresponde a lo solicitado o requiere información adicional, puede comunicarse con el instructor encargado del programa:
                            </p>

                            <div style="background-color: #f8f9fa; border-radius: 6px; padding: 15px 20px; margin: 15px 0 25px 0;">
                                <p style="margin: 0 0 5px 0; font-size: 14px; color: #6c757d;">Instructor responsable:</p>
                                <p style="margin: 0; font-size: 16px; color: #003366; font-weight: 600;">
                                    📧 ${nombreInstructor} ${apellidoInstructor}
                                </p>
                            </div>
                            <div style="background-color: #f8f9fa; border-radius: 6px; padding: 15px 20px; margin: 15px 0 25px 0;">
                                <p style="margin: 0 0 5px 0; font-size: 14px; color: #6c757d;">Contacto instructor:</p>
                                <p style="margin: 0; font-size: 16px; color: #003366; font-weight: 600;">
                                    📧 ${emailInstructor}
                                </p>
                            </div>
                        </div>

                        <!-- Nota importante -->
                        <div style="margin-top: 35px; background-color: #eef2f7; padding: 15px 20px; border-radius: 6px;">
                            <p style="margin: 0; font-size: 13px; color: #4a5568; display: flex; align-items: center;">
                                <span style="font-size: 18px; margin-right: 10px;">📌</span>
                                Tenga en cuenta que esta decisión corresponde a los procesos administrativos establecidos por la institución.
                            </p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f8f9fa; padding: 25px 35px; border-top: 1px solid #e9ecef;">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                            <div style="color: #6c757d; font-size: 12px;">
                                <p style="margin: 0 0 5px 0;">Servicio Nacional de Aprendizaje - SENA</p>
                                <p style="margin: 0;">Dirección General: Calle 57 No. 8-69, Bogotá D.C.</p>
                                <p style="margin: 5px 0 0 0;">Línea de atención: 018000 910270</p>
                            </div>
                            <div style="color: #adb5bd; font-size: 11px; margin-top: 15px; width: 100%; text-align: center;">
                                <p style="margin: 0;">Este es un mensaje automático, por favor no responder a esta dirección de correo.</p>
                                <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} SENA - Todos los derechos reservados</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        })
        console.log("Correo enviado correctamente")
    } catch (error) {
        console.error(error.response?.body || error)
    }
}
export { emailEliminado };
