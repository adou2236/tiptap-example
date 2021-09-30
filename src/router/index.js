import Vue from 'vue';
import Router from 'vue-router';

const Home = () => import('../views/Home');
const Detail = () => import('../views/Detail')

Vue.use(Router);

const router =  new Router({
    mode: 'history',
    routes: [
        {
            name: 'home',
            path: '/',
            component: Home,
        },
        {
            name: 'detail',
            path: '/detail/:id',
            component: Detail,
        },
    ],
});
export default router;


