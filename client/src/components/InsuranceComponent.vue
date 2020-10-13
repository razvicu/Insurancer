<template>
    <tr class="row">
        <td class="col-3">{{ insuredName }}</td>
        <td class="col-2">{{ licensePlate }}</td>
        <td class="col-3">{{ phoneNumber }}</td>
        <td class="col-2">{{ expirationDate | formatDate }}</td>
        <td class="col-1" v-on:click="editInsurance"><font-awesome-icon icon="pen"/></td>
        <td class="col-1" v-on:click="deleteInsurancePrompt"><font-awesome-icon icon="times"/></td>
    </tr>
</template>

<script>

export default {
    name: "InsuranceComponent",
    props: {
        id: {
            type: Number
        },
        insuredName: {
            type: String,
            default: 'Popescu Ion'
        },
        licensePlate: {
            type: String
        },
        phoneNumber: {
            type: String
        },
        expirationDate: {
            type: String
        }
    },
    data() {
        return {
            error: ""
        }
    },
    methods: {
        editInsurance() {
            this.$emit('edit-insurance');
        },
        deleteInsurancePrompt() {
            this.$emit('delete-insurance-prompt');
        }
    }
}
</script>

<style scoped>

</style>