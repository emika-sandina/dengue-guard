const fs = require('fs');
fetch('http://localhost:5000/api/report-cases')
  .then(r => r.text())
  .then(text => fs.writeFileSync('dump.json', text))
  .catch(console.error);
