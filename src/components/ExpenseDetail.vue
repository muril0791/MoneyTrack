<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
    <div class="bg-cardbg p-6 rounded shadow-xl w-1/2 text-textwhite">
      <h2 class="text-xl font-bold mb-4">Detalhes do Lançamento</h2>
      <p><strong>Data:</strong> {{ expense.data }}</p>
      <p><strong>Tipo:</strong> {{ expense.tipo }}</p>
      <p><strong>Modalidade:</strong> {{ expense.modalidade }}</p>
      <p><strong>Valor:</strong> R$ {{ Number(expense.valor).toFixed(2) }}</p>
      <p><strong>Descrição:</strong> {{ expense.descricao }}</p>
      <p><strong>Pagamento:</strong> {{ expense.pagamento }}</p>
      <p><strong>Categoria:</strong> {{ expense.categoria }}</p>
      <button @click="$emit('close')" class="mt-4 bg-redmain text-white px-4 py-2 rounded">
        Fechar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpenseDetail",
  props: { expense: Object }
};
</script>
