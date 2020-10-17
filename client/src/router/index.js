import Vue from "vue"
import VueRouter from "vue-router"
import AddInsuranceComponent from "../components/AddInsuranceComponent"
import ListInsurancesComponent from "../components/ListInsurancesComponent"
import StatusComponent from "../components/StatusComponent"

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
    },
    {
        path: '/status',
        name: "Status",
        component: StatusComponent
    }
]

const router = new VueRouter({
        mode: "history",
        base: process.env.BASE_URI,
        routes
    }
);

export default router;