<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand">Insurancer</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
                <a class="nav-item nav-link active" ><router-link to="/">Home</router-link> <span class="sr-only">(current)</span></a>
                <a class="nav-item nav-link"><router-link to="/add">Adauga</router-link></a>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: "NavbarComponent",

}
</script>