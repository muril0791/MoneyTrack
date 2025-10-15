<template>
    <div class="space-y-6">
      
        <div class="card">
            <div class="card-header">
                <h3>Transações</h3>
                <button class="btn-green" @click="$emit('add-transaction')">Adicionar <span>＋</span></button>
            </div>
        </div>

       
        <div class="card">
            <div class="card-header">
                <h3>Cartões</h3>
                <button class="link" @click="$emit('open-cards')">Ver todos</button>
            </div>
            <div class="p-4">
                <div v-if="!hasCards" class="empty">Nenhum cartão cadastrado.</div>
                <div v-else class="mock-card" />
                <div class="mt-4 flex gap-2">
                    <button class="btn-green" @click="$emit('open-cards')">Add Cartão</button>
                    <button class="btn-red">Remover</button>
                </div>
            </div>
        </div>

        
        <div class="card">
            <div class="card-header">
                <h3>Objetivos</h3>
                <button class="link">Ver todos</button>
            </div>
            <div class="p-4">
                <div class="progress">
                    <div class="bar" style="width:38%"></div>
                </div>
                <div class="mt-1 text-right text-emerald-400 text-sm">R$ 440.000</div>
            </div>
        </div>
    </div>
</template>

<script>
export default { name: "LeftColumn", props: { hasCards: Boolean } };
</script>

<style scoped>
.card {
    background: #1b1b1b;
    border-radius: 16px;
    border: 1px solid #2a2a2a;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid #2a2a2a;
}

.btn-green {
    background: #22c55e;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: .45rem .8rem;
    font-weight: 600;
}

.btn-green span {
    margin-left: .25rem;
}

.btn-red {
    background: #2a1313;
    color: #ffb3b3;
    border: none;
    border-radius: 10px;
    padding: .45rem .8rem;
}

.link {
    color: #76eab3;
    font-size: .85rem;
}

.empty {
    color: #a3a3a3;
    font-size: .9rem;
}

.mock-card {
    height: 120px;
    border-radius: 12px;
    background: linear-gradient(160deg, #2a2a2a, #3b3b3b);
    border: 1px solid #333;
}

.progress {
    height: 10px;
    background: #0f0f0f;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    overflow: hidden;
}

.bar {
    height: 100%;
    background: #22c55e;
}
</style>
