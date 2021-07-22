const fs = require('fs');
const readline = require('readline');
const path = require('path');
const resolve = require('path').resolve;
const fastify = require('fastify')({
  logger:true,
  ignoreTrailingSlash: true
});

let oQuestions = {

}



async function processLineByLine() {
  const fileStream = fs.createReadStream(path.join(__dirname,'intrebari.txt'));
  let lastSecond = 0;
  let second = 0;
  
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  let activeQuestion = 0;

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    
	if (line.charAt(0)=="")
		continue;
	
	if ((line.charAt(0)=="&") || (!isNaN(line.charAt(0)))){
		let i=0;
		let hasImages=false;
		if (line.charAt(0)=="&") {
			i=1;
			hasImages = true;

		}
		
		let iQuestionNumber = "";
		
		while (!isNaN(line.charAt(i)) && line.trim()!="") {

			iQuestionNumber+=line.charAt(i);
			i++;
		}
		
		activeQuestion = parseInt(iQuestionNumber,10);
		console.log(activeQuestion);
		oQuestions[activeQuestion] = {};
		oQuestions[activeQuestion].id = activeQuestion;
		oQuestions[activeQuestion].title = line.substr(i+1).trim();
		oQuestions[activeQuestion].images = hasImages
		oQuestions[activeQuestion].options = {a:"",b:"",c:""}
		oQuestions[activeQuestion].answer = ""
		continue;
	}
	
	let i=0;
	if (line.charAt(0)=="*") {
		oQuestions[activeQuestion].answer = line.charAt(1);
		i=1;
	}

	oQuestions[activeQuestion].options[line.charAt(i)] = line.substr(i+2).trim()
  }
  
  fs.writeFileSync("questions.json", JSON.stringify(oQuestions, null, 2))

}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


fastify.register(require('point-of-view'), {
  engine: {
    eta: require('eta')
  },
  root:'web',
  options: {
    filename: resolve('web')
  }
})

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
	return array;
}

oQuestions = JSON.parse(fs.readFileSync(path.join(__dirname,'questions.json'), 'utf8'));
let capitole = {
		"1": {
			id:1,
			title: 'CAPITOLUL I , SUBCAPITOLUL I. A -  MAMIFERE MARI',
			from:1,
			to: 251
		},
		"2": {
			id:2,
			title: 'CAPITOLUL I , SUBCAPITOLUL I. B -  MAMIFERE MICI',
			from:252,
			to: 341
		},
		"3": {
			id:3,
			title: 'CAPITOLUL I , SUBCAPITOLUL I. C -  PASARI',
			from:342,
			to: 521
		},
		"4": {
			id:4,
			title: 'CAPITOLUL II - LEGISLAŢIE IN DOMENIUL CINEGETIC',
			from:522,
			to: 618
		},
		"5": {
			id:5,
			title: 'CAPITOLUL III - ETICĂ VANATOREASCA',
			from:619,
			to: 656
		},
		"6": {
			id:6,
			title: 'CAPITOLUL IV - CHINOLOGIE',
			from:657,
			to: 689
		},
		"7": {
			id:7,
			title: 'CAPITOLUL V - BOLI ALE VÂNATULUI',
			from:690,
			to: 710
		},
		"8": {
			id:8,
			title: 'CAPITOLUL VI - ARME, MUNIŢII ŞI ECHIPAMENTE DE VÂNĂTOARE',
			from:711,
			to: 753
		},
		"9": {
			id:9,
			title: 'CAPITOLUL VII - MANAGEMENTUL SPECIILOR DE INTERES VÂNĂTORESC',
			from:754,
			to: 874
		},
		"10": {
			id:10,
			title: 'CAPITOLUL VIII - ORGANIZAREA ȘI PRACTICAREA VÂNĂTORII',
			from:875,
			to: 1000
		}
	}

fastify.register(require('fastify-static'), {
  root: path.join(__dirname,'web'),
  //prefix: '/web/', // optional: default '/'
})
fastify.get('/', async function (req, reply) {
	reply.view('index.html',{'page':'home','an':new Date().getFullYear()})
})
fastify.get('/chestionar-examen-vanator.html', async function (req, reply) {
	reply.view('chestionar.html',{'page':'chestionar','an':new Date().getFullYear()})
})
fastify.get('/test-examen-vanator.html', async function (req, reply) {
	reply.view('chestionar-full.html',{'page':'chestionar-full','an':new Date().getFullYear()})
})
fastify.get('/teste-examen-vanatoare-capitole.html', async function (req, reply) {
	reply.view('chestionar-capitole.html',{'page':'chestionar-capitole','an':new Date().getFullYear()})
})
fastify.get('/raspunsuri-si-intrebari-examen-vanatoare.html', async function (req, reply) {
	reply.view('chestionar-raspunsuri.html',{'page':'chestionar-raspunsuri','an':new Date().getFullYear()})
})

fastify.get('/chestionar.json', async function (req, reply) {

	
	let questions = {

	}
	let totalIntrebari = 0;
	let leftPercent= 0;
	for (const [key, value] of Object.entries(capitole)) {
		
		let percentOfTotal = (value.to-value.from+1)*100/1000;
		let totalIntrebariCapitol = percentOfTotal*30/100
		leftPercent += Math.ceil(totalIntrebariCapitol)-totalIntrebariCapitol;
		totalIntrebariCapitol = Math.floor(totalIntrebariCapitol)

		if (leftPercent>1) {
			leftPercent = Math.ceil(leftPercent)-leftPercent;
			totalIntrebariCapitol++;
		}
		let i=1;
		while (i<=totalIntrebariCapitol) {
			let rNumber = getRandomArbitrary(value.from,(value.to+1));
			for (const [index,question] of Object.entries(questions)) {
				if (question.id==rNumber) {
					console.log('duplicate found',rNumber);
					rNumber = 0;
					break;
				}
			}
			if (!rNumber) continue;
			questions[(totalIntrebari+i)] = oQuestions[rNumber];
			i++;
		}
		totalIntrebari+=totalIntrebariCapitol;
	}
	
	if (totalIntrebari<30){
		i=totalIntrebari+1;
		while (i<=30) {
			let rNumber = getRandomArbitrary(1,1001);
			for (const [index,question] of Object.entries(questions)) {
				if (question.id==rNumber) {
					console.log('duplicate found',rNumber);
					rNumber = 0;
					break;
				}
			}
			if (!rNumber) continue;
			questions[i] = oQuestions[rNumber];
			i++;
		}
		
	}
	let aKeys = shuffleArray(Object.keys(questions));
	let oNewQuestions = {};

	for (let i=0;i<aKeys.length;i++) {
		oNewQuestions[i+1]=questions[aKeys[i]]
	}


  return reply.send(oNewQuestions)
})

fastify.get('/all.json', async function (req, reply) {
  return reply.send({questions:oQuestions,capitole:capitole})
})

// Run the server!
fastify.listen(process.env.PORT || 8000, "0.0.0.0", (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})

//processLineByLine();