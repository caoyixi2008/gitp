<template>

  <div>

    <h2>饮食记录</h2>


    <input
      :value="foodDate"
      type="date"
      @input="$emit('update:foodDate',$event.target.value)"
    />


    <input
      :value="foodName"
      placeholder="食物名称"
      @input="$emit('update:foodName',$event.target.value)"
    />


    <input
      :value="foodCal"
      placeholder="卡路里（kcal）"
      @input="$emit('update:foodCal',$event.target.value)"
    />


    <button @click="$emit('add')">
      添加饮食
    </button>



    <ul>

      <li
        v-for="(item,index) in list"
        :key="index"
      >

        <div>
          📅 {{ item.date }}
        </div>


        <div>
          🍔 {{ item.name }}
        </div>


        <div>
          🔥 {{ item.cal }} kcal
        </div>


        <button
          class="delete-btn"
          @click="$emit('delete',index)"
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

  foodDate:String,

  foodName:String,

  foodCal:String

})


defineEmits([

  'update:foodDate',

  'update:foodName',

  'update:foodCal',

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