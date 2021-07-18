const fs = require('fs');
const readline = require('readline');
const path = require('path');
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

oQuestions = JSON.parse(fs.readFileSync(path.join(__dirname,'questions.json'), 'utf8'));

fastify.register(require('fastify-static'), {
  root: path.join(__dirname,'web'),
  //prefix: '/web/', // optional: default '/'
})

fastify.get('/chestionar.json', async function (req, reply) {
  let questions = {

  }

  for (let i=1;i<=30;i++) {
	  let rNumber = getRandomArbitrary(1,1001);
	  questions[i] = oQuestions[rNumber];
  }
  
  return reply.send(questions)
})

// Run the server!
fastify.listen(process.env.PORT || 8000, "0.0.0.0", (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})

//processLineByLine();