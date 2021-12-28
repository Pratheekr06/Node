const fs = require('fs');
const http = require('http');

const server = http.createServer((req,res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title><head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"/><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body);
            console.log(parsedBody.toString());
            const msg = parsedBody.toString().split('=')[1];
            fs.writeFile('message.txt', msg, (err) => {
                res.writeHead(302, {
                    'Location': '/',
                });
                return res.end();
            });
        })
        // res.writeHead(302, {
        //     'Location': '/',
        // });
        // return res.end();
    }
    res.setHeader('Content-Type', 'text/html');
    res.write(
        '<html><body><h1>Hi Hello</h1></body></htm>'
    )
    res.end();
});

server.listen(3000);