import Vue from "vue"
import VueRouter from "vue-router"
import AddInsuranceComponent from "../components/AddInsuranceComponent"
import ListInsurancesComponent from "../components/ListInsurancesComponent"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/add',
        name: "Add Insurance",
        component: AddInsuranceComponent
    },
    {
        path: '/home',
        name: "Home",
        component: ListInsurancesComponent
    }
]

const router = new VueRouter({
        mode: "history",
        base: process.env.BASE_URI,
        routes
    }
);

export default router;