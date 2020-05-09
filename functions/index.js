const admin = require('firebase-admin');
const functions = require('firebase-functions');

const nodeMailer = require('nodemailer');
const corsModule = require('cors');
const cors = corsModule({ origin: true });

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send(`
        <h1>Olá Dev!</h1>
        <p>Essa página para estudo do firebase com nodeMailer.</p>
        <form action='https://us-central1-sendmailer-6db8c.cloudfunctions.net/sendMailer' method='GET'>
        
        <p>Digite o host:</p>
        <input name='host' type='text' />

        <p>Digite seu email:</p>
        <input name='email' type='text' />

        <p>Digite sua senha:</p>
        <input name='pass' type='password' />

        <p>Digite a porta:</p>
        <input name='port' type='text' />

        <hr>

        <p>Digite o email de destino:</p>
        <input name='destino' type='text' />

        <p>Assunto:</p>
        <input name='assunto' type='text' />

        <p>html:</p>
        <input name='conteudo' type='text' />
        
        <button type='submit'>Enviar</button>
        </form>
    `);
});

exports.sendMailer = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        let arquivo = req.query;

        let transporter = nodeMailer.createTransport({
            host: arquivo.host,
            port: arquivo.port,
            secure: false,
            auth: {
                user: arquivo.email,
                pass: arquivo.pass
            }
        });

        let mailOptions = {
            'from': arquivo.email,
            'to': arquivo.destino,
            'subject': arquivo.assunto,
            'html': arquivo.conteudo
        }

        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(`
                <h1>Erro ao enviar a mensagem!</h1>
                <p>Erro: ${erro.toString()}</p>
                <form action='https://us-central1-sendmailer-6db8c.cloudfunctions.net/helloWorld'>
                <button type='submit'>Página inicial</button>
                </form>
                `);
            }

            return res.send(`
            <h1>Seu email foi enviado!</h1>
            <form action='https://us-central1-sendmailer-6db8c.cloudfunctions.net/helloWorld'>
            <button type='submit'>Página inicial</button>
            </form>
            `);
        })
    })
})
