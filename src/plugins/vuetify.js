import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light:{
                primary: '#1664D8',
                secondary: '#12223D',
                accent: '#0C182D'
            }
        }
    }
});
