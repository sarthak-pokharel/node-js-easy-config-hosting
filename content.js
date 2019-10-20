const fs = require('fs');

let {log} = console;

function readFile(namef) {
	let cont = fs.readFileSync(namef);
	return cont;
}
function parseJSON(str) {
	try {
		return JSON.parse(str);
	}catch(err) {
		//log(err);
		return ({});
	}
}

function contentToServe(request) {
	let url = request.url;
	let mappings = parseJSON(readFile('./web-config/web-map.json'));
	let aliases = parseJSON(readFile('./web-config/web-aliases.json'));
	let not_found_cont = [[404,'text/html'],readFile('./edocs/404.html')];
	let gameOfAlias = isalias(url,aliases);
	if(mappings.hasOwnProperty(url)) {
		try {
			if(mappings[url] instanceof Array) {
				return [[mappings[url][0], mappings[url][1]],
					readFile(mappings[url][2])];
			}
			return [[200, getType(mappings[url])], readFile(mappings[url])];
		}catch(err) {
			//log(err);
		}
		return not_found_cont;
	}else if(gameOfAlias[0]) {
		try {
			return [[200,getType(gameOfAlias[1])],readFile(gameOfAlias[1])];
		}catch(err) {
			//log(err);
			return not_found_cont;
		}
	}else {
		try {
			let fcont = readFile("./app-root" + url);
			let rct = [[200, getType("./app-root" + url)], fcont];
			return rct;
		}catch(err2) {
			//log(err2);
		}
		return not_found_cont;
	}
	return not_found_cont;
}

function getType(fileName) {
	let typeMapping = parseJSON(readFile('./web-config/type-mappings.json'));
	let fextention = fileName.split('.').pop().toLowerCase();
	for(let key in typeMapping) {
		if(typeMapping[key].split(/\s+/).map(x=>x.toLowerCase()).includes(fextention)){
			return key;
		}
	};
	return "text/plain";
}
function isalias(url,aliases) {
	for (let alias in aliases) {
		if(url.startsWith(alias)) {
			return [true, aliases[alias] + url.replace(alias,'')];
		}
	}
	return [false];
}
exports.contentToServe = contentToServe;