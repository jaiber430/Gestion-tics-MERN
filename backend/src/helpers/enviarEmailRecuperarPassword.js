import sgMail from "@sendgrid/mail";
import 'dotenv/config'

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailRecuperacion = async ({ email, passwordActualizada }) => {
    try {
        await sgMail.send({
            to: email,
            from: "jaiberworks4302@gmail.com",
            subject: "Solicitud de recuperación de acceso",
            html: `
                <div style="font-family: Arial; line-height: 1.6;">
                    <h3>Hola 👋</h3>
                    <p>Recibimos una solicitud para restablecer el acceso a tu cuenta.</p>
                    <p>Si fuiste tú, usa el siguiente código:</p>
                    <p style="font-size: 20px;"><b>${passwordActualizada}</b></p>
                    <p>Si no solicitaste esto, ignora este mensaje.</p>
                    <hr>
                    <small>Mensaje automático, no respondas.</small>
                </div>
                `
        });
        console.log("Correo enviado correctamente");
    } catch (error) {
        console.error(error.response?.body || error);
    }
};

export { emailRecuperacion };
