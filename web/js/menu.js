const MenuComponent = {
  data(){
	  return {
		  mobileMenuIsOpen:0
	  }
  },
  computed: {
	
  }
}
const appMenu = Vue.createApp(MenuComponent)
const vmMenu = appMenu.mount('#menu')