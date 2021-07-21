const RootComponent = {
  data(){
	  return {
		questions:{
		},
		capitole:{},
		sectionVisible:'',
		selectedCapitol:{},
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
	})
  },
  methods: {
  	check() {

	},
	selectCapitol(capitol){
		this.sectionVisible='chestionar'
		this.selectedCapitol = this.capitole[capitol];
	},
	inapoi(){
		this.sectionVisible='capitole'
		this.selectedCapitol = {};
	}
  },
  computed: {
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
	totalQuestionsInSection(){
		return this.selectedCapitol.to-this.selectedCapitol.from+1;
	}
  }
}
const app = Vue.createApp(RootComponent)
const vm = app.mount('#app')