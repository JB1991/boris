
const fs = require('fs');

const nipix = String(fs.readFileSync('00-_NIPX_Final_bis_2019_1_mit_gewichtung.csv'));

const lines = nipix.split(/\r\n|\r|\n/g);

for (let i = 1; i < lines.length; i++) {
	const line = lines[i].split(';');

	if (line[0].length > 10) { // If line is valid

		if ((typeof line[1] === 'string') && (line[1].indexOf('_') !== -1)) {
			line[1] = line[1].substr(0, line[1].indexOf('_'));
		}

		const nval = {};
		nval['index'] = line[4].replace(',', '.');
		nval['faelle'] = line[3].replace(',', '.');
		if (nval['index'] !== '') {

			const sql = 'INSERT INTO nipix_data ('+
					' name,'+
					' type,'+
					' quartal,'+
					' index,'+
					' amount'+
					' ) VALUES ('+
						' \''+line[1]+'\','+
						' \''+line[0]+'\','+
						' \''+line[2]+'\','+
						' \''+nval['index']+'\','+
						' \''+nval['faelle']+'\''+
						' );';
			console.log(sql);
		}
	}
}

