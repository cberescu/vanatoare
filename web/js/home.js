const RootComponent = {
  data(){
	  return {
		questions:{
		},
		search:""

	  }
  },
  created() {
    // `this` points to the vm instance
    fetch("/all.json").then((response )=>{
		return response.json();
		//this.questions = 
	}).then((data)=>{
		this.questions = data.questions;
	})
  },
  methods: {
  },
  computed: {
	foundQuestions(){
		if ((!this.search) || (this.search.length<3))  return {};
		let results = [];
		let search = this.search.replace(/\s+/g,' ')
		search = search.split(' ');
		search = search.join('.*')
		for (const [key, value] of Object.entries(this.questions)) {
			  if (value.title.match(new RegExp(search, 'gi')))
			  	results.push(value);
		}
		return results
	}
  }
}
const app = Vue.createApp(RootComponent)
const vm = app.mount('#app')