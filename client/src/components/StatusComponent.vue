<template>
    <div>
        <p>Last status: {{statusMessage}}</p>
    </div>
</template>

<script>
import InsuranceService from '../InsuranceService';
export default {
    name: "StatusComponent",
    data() {
        return {
            statusMessage: ''
        }
    },
    mounted() {
        this.getStatus();
    },
    methods: {
        async getStatus() {
            await InsuranceService.getStatus().then((res) => {
                console.log(res);
                this.statusMessage = res.data;
            });
        }
    }
}
</script>