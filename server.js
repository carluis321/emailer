const express = require('express');

const app = express();

const mailer = require('nodemailer');

const hbs = require('nodemailer-express-handlebars');

const hb = require('handlebars');

const path = require('path');

const pg = require('pg');

const infoConnect = {
  host: 'localhost',
  username: 'postgres',
  password: 'c123456789',
  database: 'emailer'
}

const connect = 'postgress://' + infoConnect.username + ':' + infoConnect.password
  + '@' + infoConnect.host + '/' + infoConnect.database;

const client = new pg.Client(connect);

client.connect( (err) => {
	if(err){
		throw err;
	}

	client.on('notification', (msg) => {
		var data = JSON.parse(msg.payload);

		client.query('INSERT INTO service_log(job, created) VALUES (\'emailer\', NOW())');

		client.query('SELECT * FROM www_users WHERE id=\'' + data.user_id + '\'', 
			 (err, res) => {
				if(err){
					throw err;
				}

				var user = res.rows[0];

				let transporter = mailer.createTransport({
					service: 'gmail',
					port: 587,
					secure: false,
					auth: {
						user: 'user',
						pass: 'pass'
					}
				});

				transporter.use('compile', hbs({
					viewEngine: hb,
					extName: '.html',
					viewPath: './templates/'
				}));

				let mailOptions = {
					to: user.email,
					subject: data.email.subject,
					template: data.template,
					context: data.email.data
				};

				transporter.sendMail(mailOptions, (err, info) => {
					if(err){
						app.get('/', (req, res) => {
							res.send('hello!');
						});

						throw err;
					}

					client.query('INSERT INTO emails_sent VALUES (200, ' + user.id + ', \'' 
						+ data.email.subject + '\', \'' + data.template + '\', \'' + JSON.stringify(data.email.data) + '\')');
				});
    	}
    );
	});

	var query = client.query("LISTEN sendmail");

	console.log('Connect to PostgreSQL');
});