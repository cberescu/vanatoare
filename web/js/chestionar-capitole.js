const RootComponent = {
  data(){
	  return {
		questions:{
		},
		activeQuestion: 0,
		capitole:{},
		stats:{
			success:[],
			fail:[]
		},
		selectedOption:"",
		testCompleted:false,
		showResult:false,
		sectionVisible:'',
		selectedCapitol:{},
		retryFailed:false
	  }
  },
  created() {
    // `this` points to the vm instance
    fetch("/all.json").then((response )=>{
		return response.json();
		//this.questions = 
	}).then((data)=>{
		this.questions = data.questions;
		this.capitole = data.capitole;
		this.sectionVisible='capitole';
		let stats = JSON.parse(localStorage.getItem('stats'));
		if (stats != null) {
			for (const [key, value] of Object.entries(stats)) {
				this.capitole[key].stats=value;
			}
		}
	})
  },
  methods: {
    next() {
      // `this` will refer to the component instance
	 
	  if (this.selectedOption=="") return;
	  if (!this.showResult) {
		  	this.showResult=true; 
			this.questions[this.activeQuestion].givenAnswer=this.selectedOption;
			if (!this.retryFailed) {
				if (this.selectedOption==this.questions[this.activeQuestion].answer){
					this.selectedCapitol.stats.success.push(this.activeQuestion);
				} else {
					this.selectedCapitol.stats.fail.push(this.activeQuestion);
				}
				let stats = JSON.parse(localStorage.getItem('stats'));
				if (stats == null)
					stats = {};
				console.log(stats);
				stats[this.selectedCapitol.id]=this.selectedCapitol.stats;
				localStorage.setItem('stats', JSON.stringify(stats));
			}
			return;
	  }
	  this.selectedOption="";
	  this.showResult = false;
      
	  if (this.retryFailed) {
		  let index = this.selectedCapitol.stats.fail.indexOf(this.activeQuestion);
		  console.log(index,this.selectedCapitol.stats.fail.length)
		  if ((index+1)>=this.selectedCapitol.stats.fail.length){
			  	this.testCompleted = true;
		  		return;
		  }
		  this.activeQuestion = this.selectedCapitol.stats.fail[(index+1)];
	  } else {
		  	if ((this.activeQuestion+1)>this.selectedCapitol.to) {
		  		this.testCompleted = true;
		  		return;
	  		}
		  this.activeQuestion++;
	  } 
    },
	check() {

	},
	selectCapitol(capitol){
		this.sectionVisible='chestionar'
		this.activeQuestion = this.capitole[capitol].from;
		this.selectedCapitol = this.capitole[capitol];
		this.retryFailed=false;
		this.selectedCapitol.stats = {
			success:[],
			fail:[]
		}

	},
	gresite(capitol){
		this.sectionVisible='chestionar'
		this.selectedCapitol = this.capitole[capitol];
		this.activeQuestion = this.selectedCapitol.stats.fail[0];
		this.retryFailed = true;

	},
	inapoi(){
		this.sectionVisible='capitole'
		this.activeQuestion = 0;
		this.selectedCapitol = {};
		this.testCompleted = false;

	}
  },
  computed: {
	labelBtnNext(){
		return this.showResult ? 'Urmatoarea intrebare' : 'Verifica';
	}, 
	sectionRows(){
		let rows = [];
		let row=[];
		for (const [key, value] of Object.entries(this.capitole)) {
			value.id=key;
			row.push(value);
			if (row.length==2) {
				rows.push(row);
				row=[];
			}
		}
		return rows;
	},
	oQuestion(){
		return typeof this.questions[this.activeQuestion] !="undefined" ? this.questions[this.activeQuestion] : {}
	},
	questionIndex(){
		return (this.activeQuestion-this.selectedCapitol.from+1);
	},
	totalQuestionsInSection(){
		return this.selectedCapitol.to-this.selectedCapitol.from+1;
	},
	percentOfSection(){
		let index = (this.activeQuestion-this.selectedCapitol.from+1);
		let total = this.selectedCapitol.to-this.selectedCapitol.from+1;
		return parseInt(Math.ceil(index*100/total),10);

	}

	
  }
}
const app = Vue.createApp(RootComponent)
const vm = app.mount('#app')