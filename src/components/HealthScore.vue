<template>

  <div class="score-card">

    <h2>🏆 今日健康评分</h2>

    <div class="score">
      {{ score }}
      <span>/100</span>
    </div>

  </div>

</template>


<script setup>

defineProps({

  score:{
    type:Number,
    default:100
  }

})

</script>


<style scoped>

.score-card{

    background:white;
    margin:20px 0;
    padding:20px;
    text-align:center;
    border-radius:15px;
    box-shadow:0 3px 10px rgba(0,0,0,.08);

}

.score{

    font-size:50px;
    color:#409EFF;
    font-weight:bold;

}

.score span{

    font-size:20px;
    color:#999;

}

</style>