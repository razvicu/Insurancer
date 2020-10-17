<template>
    <b-navbar type="light" variant="light">
        <b-navbar-brand>Insurancer</b-navbar-brand>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item><router-link to="/">Home</router-link></b-nav-item>
                <b-nav-item><router-link to="/add">Adauga</router-link></b-nav-item>
                <b-nav-item><router-link to="/status">Status</router-link></b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
export default {
    name: "NavbarComponent",

}
</script>