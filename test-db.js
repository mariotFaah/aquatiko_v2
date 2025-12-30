const mysql = require('mysql2');

console.log('🧪 Test de connexion à MariaDB...');

const connection = mysql.createConnection({
  host: 'mariadb',
  port: 3306,
  user: 'admin',
  password: 'adminpassword',
  database: 'gestion_entreprise',
  connectTimeout: 10000
});

connection.connect((err) => {
  if (err) {
    console.error('❌ ERREUR:', err.message);
    console.error('Code:', err.code);
    console.error('Errno:', err.errno);
    console.error('État SQL:', err.sqlState);
    process.exit(1);
  }
  
  console.log('✅ SUCCÈS: Connecté à MariaDB!');
  
  // Tester une requête
  connection.query('SELECT VERSION() as version', (err, results) => {
    if (err) {
      console.error('❌ Erreur requête:', err.message);
    } else {
      console.log('✅ Version MariaDB:', results[0].version);
    }
    
    connection.end();
    process.exit(err ? 1 : 0);
  });
});
