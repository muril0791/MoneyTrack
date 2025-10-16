<template>
  <div class="table-wrap">
    <table class="tx-table">
      <thead>
        <tr>
          <th>Transação</th>
          <th>Categoria</th>
          <th>Tipo</th>
          <th>Valor</th>
          <th>Data</th>
          <th>Saldo</th>
          <th class="w-20">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(e, i) in normalized" :key="e.id || i">
          <td class="truncate">{{ e.descricao || '—' }}</td>
          <td>
            <span class="badge badge-blue">{{ categoryName(e.categoria) }}</span>
          </td>
          <td>
            <span :class="['badge', e.tipo === 'entrada' ? 'badge-green' : 'badge-red']">
              {{ e.tipo === 'entrada' ? 'Entrada' : 'Saída' }}
            </span>
          </td>
          <td>{{ money(e.valor) }}</td>
          <td>{{ dateBR(e.data) }}</td>
          <td class="muted">{{ runningBalance(i) }}</td>
          <td class="actions">
            <button class="link" @click="$emit('edit-expense', e)">Editar</button>
            <button class="link red" @click="$emit('delete-expense', e)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "ExpenseList",
  props: { expenses: { type: Array, required: true }, categories: { type: Array, default: () => [] }, creditCards: { type: Array, default: () => [] } },
  computed: {
    normalized() {
      return [...this.expenses].sort((a, b) => new Date(a.data) - new Date(b.data));
    }
  },
  methods: {
    money(v) { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0)); },
    dateBR(d) { const dt = new Date(d); return dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }); },
    categoryName(id) { const c = this.categories.find(x => x.id === id); return c?.name || '—'; },
    runningBalance(rowIdx) {
      const until = this.normalized.slice(0, rowIdx + 1);
      const income = until.filter(e => e.tipo === 'entrada').reduce((s, e) => s + Number(e.valor), 0);
      const out = until.filter(e => e.tipo === 'saida').reduce((s, e) => s + Number(e.valor), 0);
      return this.money(income - out);
    }
  }
}
</script>

<style scoped>
.table-wrap {
  overflow-x: auto;
}

.tx-table {
  width: 100%;
  border-collapse: collapse;
  color: #e7e7e7;
  font-size: .92rem;
}

.tx-table thead th {
  text-align: left;
  font-weight: 600;
  color: #a0a0a0;
  padding: 12px 14px;
  border-bottom: 1px solid #2a2a2a;
}

.tx-table tbody td {
  padding: 12px 14px;
  border-bottom: 1px solid #2a2a2a;
}

.tx-table tbody tr:hover td {
  background: #181818;
}

.badge {
  font-size: .75rem;
  padding: .15rem .55rem;
  border-radius: 999px;
  font-weight: 600;
  display: inline-block;
}

.badge-green {
  background: #123e28;
  color: #7ff0b5;
  border: 1px solid #1b8a56;
}

.badge-red {
  background: #3b1616;
  color: #ffb4b4;
  border: 1px solid #a33c3c;
}

.badge-blue {
  background: #0d2b47;
  color: #7ec4ff;
  border: 1px solid #274b6e;
}

.muted {
  color: #cfcfcf;
}

.actions {
  white-space: nowrap;
}

.link {
  background: none;
  border: none;
  color: #76eab3;
  cursor: pointer;
  font-weight: 600;
}

.link.red {
  color: #ff9c9c;
}
</style>
