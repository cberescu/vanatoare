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
	check() {
		for (const [key, value] of Object.entries(this.questions)) {
			if (value.answer==value.selectedOption)
				this.stats.success.push(value)
			else
			  	this.stats.fail.push(value)
		}
		this.testCompleted = true;

	},
	setAnswer(key,value){
		this.questions[key].selectedOption = value;
		return true;
		
	}, 
  },
  computed: {
	

	
  }
}
const app = Vue.createApp(RootComponent)
const vm = app.mount('#app')