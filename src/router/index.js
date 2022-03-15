import Vue from 'vue';
import Router from 'vue-router';

const product = () => import('../views/product/intelligent');
const newGeneration = () => import('../views/product/newGeneration')
const templateList = () => import("../views/templateManager/templateList")
const templateViewer = () => import("../views/templateManager/templateViewer")
const templateEditor = () => import("../views/templateManager/templateEditor/views/Detail")

Vue.use(Router);

const router =  new Router({
    mode: 'hash',
    routes: [
        {
            name: 'product',
            path: '/product',
            component: product,
        },
        {
            name: 'newGeneration',
            path: '/product/newGeneration/:id',
            component: newGeneration
        },
        {
            name: 'templateList',
            path: '/templateManager/list',
            component: templateList,
        },
        {
            name: 'templateViewer',
            path: 'templateManager/viewer/:id?',
            component: templateViewer,
        },
        {
            name: 'templateEditor',
            path: 'templateManager/editor/:id',
            component: templateEditor,
        }
    ],
});
export default router;


