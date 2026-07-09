<template>

  <div>

    <h2>运动记录</h2>


    <input 
      :value="sportDate"
      type="date"
      @input="$emit('update:sportDate',$event.target.value)"
    />

    <input 
      :value="sportType"
      placeholder="运动类型（如跑步）"
      @input="$emit('update:sportType',$event.target.value)"
    />


    <input 
      :value="sportTime"
      placeholder="时间（分钟）"
      @input="$emit('update:sportTime',$event.target.value)"
    />


    <button @click="$emit('add')">
      添加运动
    </button>



    <ul>

      <li 
        v-for="(item,index) in list"
        :key="index"
      >

        <div>📅 {{ item.recordDate }}</div>

<div>🏃 {{ item.sportType }}</div>

<div>⏱ {{ item.duration }} 分钟</div>

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

  sportDate:String,

  sportType:String,

  sportTime:String


})


defineEmits([

  'update:sportDate',

  'update:sportType',

  'update:sportTime',

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