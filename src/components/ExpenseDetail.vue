<template>
  <div class="expense-detail-overlay">
    <div class="expense-detail-container">
      <h2 class="expense-detail-title">Detalhes do Lançamento</h2>
      <p><strong>Data:</strong> {{ expense.data }}</p>
      <p><strong>Tipo:</strong> {{ expense.tipo }}</p>
      <p><strong>Modalidade:</strong> {{ expense.modalidade }}</p>
      <p><strong>Valor:</strong> R$ {{ Number(expense.valor).toFixed(2) }}</p>
      <p><strong>Descrição:</strong> {{ expense.descricao }}</p>
      <p><strong>Pagamento:</strong> {{ expense.pagamento }}</p>
      <p><strong>Categoria:</strong> {{ expense.categoria }}</p>
      <button @click="$emit('close')" class="expense-detail-close-btn">
        Fechar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpenseDetail",
  props: { expense: Object },
};
</script>

<style scoped>
:root {
  --cardbg: #161716;
  --redmain: #e93030;
  --textwhite: #c2c3c2;
}

/* Overlay cobrindo toda a tela */
.expense-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Container do Modal */
.expense-detail-container {
  background-color: var(--cardbg);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 15px rgba(0,0,0,0.3);
  width: 90%;
  max-width: 600px;
  color: var(--textwhite);
}

/* Título do Modal */
.expense-detail-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

/* Botão Fechar */
.expense-detail-close-btn {
  margin-top: 1rem;
  background-color: var(--redmain);
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.expense-detail-close-btn:hover {
  background-color: #d32f2f;
}
</style>
