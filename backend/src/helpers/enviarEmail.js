import nodemailer from 'nodemailer';

const emailRecuperacion = async (datos) => {
    const { passwordActualizada, email } = datos
    // 1. Configurar el transporte (quién envía)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jaiberworks4302@gmail.com',
            pass: 'dsfh hbyo lbxb hybm' // La contraseña de aplicación
        }
    });

    // 2. Definir el contenido del correo
    const mailOptions = {
        from: 'jaiberworks4302@gmail.com',
        to: `${email}`,
        subject: 'Nueva contraseña',
        text: '¡Hola! has solicitado una recuperacion de contraseña',
        html: `<h1>NUEVA CONTRASEÑA</h1><p>Contraseña<b>${passwordActualizada}</b>.</p>`
    };

    // 3. Enviar
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado con éxito:', info.messageId);
    } catch (error) {
        console.error('Error al enviar:', error);
    }
}

export {
    emailRecuperacion
}
