const RootComponent = {
  data(){
	  return {
		questions:{
		},
		activeQuestion: 0,
		stats:{
			success:[],
			fail:[]
		},
		selectedOption:"",
		testCompleted:false,
		showResult:false

	  }
  },
  created() {
    // `this` points to the vm instance
    fetch("/chestionar.json").then((response )=>{
		return response.json();
		//this.questions = 
	}).then((data)=>{
		this.questions = data;
		this.activeQuestion=1;
	})
  },
  methods: {
    next() {
      // `this` will refer to the component instance
	  
	  if (this.selectedOption=="") return;
	  if (!this.showResult) {
		  	this.questions[this.activeQuestion].givenAnswer=this.selectedOption;
			this.showResult=true; 
			if (this.selectedOption==this.questions[this.activeQuestion].answer){
				this.stats.success.push(this.activeQuestion);
			} else {
				this.stats.fail.push(this.questions[this.activeQuestion]);
			}
			return;
	  }
	  this.selectedOption="";
	  this.showResult = false;
      if ((this.activeQuestion+1)>Object.keys(this.questions).length) { 
		  this.testCompleted = true;
		  return;
	  }
	  this.activeQuestion++;
    },
	check() {

	}
  },
  computed: {
	labelBtnNext(){
		return this.showResult ? 'Urmatoarea intrebare' : 'Verifica';
	}, 
	oQuestion(){
		return typeof this.questions[this.activeQuestion] !="undefined" ? this.questions[this.activeQuestion] : {}
	}
	
  }
}
const app = Vue.createApp(RootComponent)
const vm = app.mount('#app')