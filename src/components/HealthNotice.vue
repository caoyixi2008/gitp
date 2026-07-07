<template>

  <div class="notice-box">

    <p>💧 每天建议饮水 1500~2000ml。</p>

    <p v-if="sport < 30">
      🏃 今日运动不足30分钟，建议增加运动量。
    </p>

    <p v-else>
      ✅ 今日运动已达标，继续保持！
    </p>


    <p v-if="cal > 2000">
      🍔 今日热量摄入偏高，建议控制饮食。
    </p>

    <p v-else>
      🥗 今日热量摄入合理，保持良好习惯。
    </p>


    <p>🌙 建议今晚23:00前休息，保持规律作息。</p>

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

.notice-box{

  background:white;
  padding:20px;
  border-radius:12px;
  box-shadow:0 3px 10px rgba(0,0,0,.08);

}


.notice-box p{

  margin:15px 0;
  font-size:18px;

}

</style>