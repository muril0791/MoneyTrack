<template>
    <div class="bg-grey p-4 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">Resumo de Gastos</h2>
        <table class="w-full table-auto">
            <thead>
                <tr>
                    <th class="px-4 py-2 border">Data</th>
                    <th class="px-4 py-2 border">Total Gasto</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(total, date) in groupedExpenses" :key="date" @click="handleRowClick(date)"
                    class="cursor-pointer hover:bg-gray-100">
                    <td class="px-4 py-2 border">{{ formatDate(date) }}</td>
                    <td class="px-4 py-2 border">R$ {{ total.toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { computed } from 'vue'

export default {
    name: 'ExpenseTable',
    props: {
        expenses: {
            type: Array,
            required: true
        }
    },
    emits: ['select-day'],
    setup(props, { emit }) {
        // Agrupa os gastos por data
        const groupedExpenses = computed(() => {
            return props.expenses.reduce((acc, expense) => {
                if (!acc[expense.date]) {
                    acc[expense.date] = 0
                }
                acc[expense.date] += Number(expense.value)
                return acc
            }, {})
        })

        const handleRowClick = (date) => {
            emit('select-day', date)
        }

        // Função para formatar a data (dd/mm/aaaa)
        const formatDate = (dateStr) => {
            const [year, month, day] = dateStr.split('-')
            return `${day}/${month}/${year}`
        }

        return {
            groupedExpenses,
            handleRowClick,
            formatDate
        }
    }
}
</script>
