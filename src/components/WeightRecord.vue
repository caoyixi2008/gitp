<template>

  <div>

    <h2>⚖️ 体重记录</h2>

    <input
      :value="weightDate"
      type="date"
      @input="$emit('update:weightDate',$event.target.value)"
    />

    <input
      :value="weight"
      placeholder="请输入体重（kg）"
      @input="$emit('update:weight',$event.target.value)"
    />

    <button @click="$emit('add')">
      添加体重
    </button>

    <ul>

      <li
        v-for="(item,index) in list"
        :key="index"
      >

        <div>📅 {{ item.date }}</div>

        <div>⚖️ {{ item.weight }} kg</div>

        <button
          class="delete-btn"
          @click="$emit('delete',item.id)"
        >
          🗑 删除
        </button>

      </li>

    </ul>

  </div>

</template>

<script setup>

defineProps({

  list:{
    type:Array,
    default:()=>[]
  },

  weightDate:String,

  weight:String

})

defineEmits([

  'update:weightDate',

  'update:weight',

  'add',

  'delete'

])

</script>

<style scoped>

input{

  width:180px;
  padding:10px;
  margin:8px;

}

button{

  padding:10px 18px;
  border:none;
  border-radius:6px;
  background:#409EFF;
  color:white;

}

li{

  margin:8px 0;
  background:white;
  padding:10px;
  border-radius:6px;

}

.delete-btn{

  background:#f56c6c;
  margin-top:8px;

}

</style>