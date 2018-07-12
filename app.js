import Vue from 'vue'
import Component from 'vue-class-component'
import Vuex from 'vuex'
import VueRx from 'vue-rx'

import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription' // Disposable if using RxJS4
import { Subject } from 'rxjs/Subject' // required for domStreams option

import store from '../../../store'
import menuComponent from '@/components/menu-component/menu-component'


Vue.use(Vuex);
Vue.use(VueRx, {
    Observable,
    Subscription,
    Subject
});

Vue.use(Vuex);

@Component({
    components: { menuComponent },
    store,
    domStreams: ['plus$'],
    subscriptions: function () {
        this.plus$ = new Subject()
        // ...then create subscriptions using the Subjects as source stream.
        // the source stream emits in the form of { event: HTMLEvent, data?: any }
        return {
            mydata: this.plus$
        }
    }
})

export default class App extends Vue {
    mydata = "Su puta madre";
    constructor() {
        super();
    }
    created() {
        //console.log(store);
        //store.commit('getParentData', this.$parent.$el.attributes["mydata"].value)
    }
    // Ejemplo de como passar data desde fuera la app
    beforeMount() {
        this.getRootData();
    }
    mounted() {
        //this.$parent.$el.attributes["mydata"].value

        console.log(this.$store.state.count);
    }
    getRootData() {
        this.$observables.mydata.next(this.$root.$el.attributes["mydata"].value);
        //this.$observables.mydata.next(this.$parent.$el.attributes["mydata"].value);
        this.$store.commit('setParentData', this.$root.$el.attributes["mydata"].value, { root: true });
    }

}

//new App({el: '#app'}).$mount()
