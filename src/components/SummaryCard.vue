<template>

  <div class="summary-box">

    <div class="card">

      <h3>🏃 今日运动</h3>

      <p>{{ sport }} 分钟</p>

    </div>


    <div class="card">

      <h3>🍔 今日摄入</h3>

      <p>{{ cal }} kcal</p>

    </div>


    <div class="card">

      <h3>🎯 剩余建议</h3>

      <p>{{ 2000 - cal }} kcal</p>

    </div>


  </div>

</template>


<script setup>

defineProps({

  sport:{
    type:Number,
    default:0
  },

  cal:{
    type:Number,
    default:0
  }

})

</script>


<style scoped>

.summary-box{

    display:flex;
    gap:20px;
    margin-bottom:30px;

}


.card{

    flex:1;
    background:white;
    padding:20px;
    border-radius:12px;

    text-align:center;

    box-shadow:0 3px 10px rgba(0,0,0,.08);

}

.card h3{

    color:#409EFF;

}


.card p{

    font-size:26px;
    color:#ff6b6b;

}

</style>