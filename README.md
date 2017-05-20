# emailer
Email Script From Nodejs Using Handlebars Template

  Script que escucha una base de datos PostgreSQL, cuando una notificación
  'sendmail' es ejecutada desde PostgreSQL, nodejs reacciona a ella,
  enviado un correo al usuario seleccionado por el template establecido en
  los datos que se envían desde Postgre, el cuál el template es un
  template de handlebars, tanto al inicio de la notificación, se registra
  la acción en un log_service y al terminar, guarda la información del
  email en una tabla de emails enviados
