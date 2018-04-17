<template>
  <div id="wrapper">
  
    <div class="title">electron-demo</div>
    <mu-raised-button class="insert-btn" :label="insert_label" @click="insert()" primary/>
    <mu-raised-button class="remove-btn" :label="remove_label" @click="remove()" primary/>

  </div>
</template>

<script>

  document.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
  });
  document.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
  });

  export default {
    name: 'LandingPage',
    components: {
    },
    data() {
        return {
            insert_label: 'insert',
            remove_label: 'remove'
        }
    },
    mounted() {
    },
    methods: {

      insert(){
        var _this = this;
        _this.$ipc.send('insert_notification');
      },

      remove(){
        var _this = this;
        _this.$ipc.send('remove_notification');
      }
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  .title {
    color: #2c3e50;
    font-size: 30px;
    font-weight: bold;
    position: absolute;
    top: 20px;
    left: 400px;
    width: 300px;
    height: 40px;
  }

  .insert-btn {
    position: absolute;
    top: 150px;
    left: 400px;
    width: 200px;
    height: 35px;
  }

  .remove-btn {
    position: absolute;
    top: 250px;
    left: 400px;
    width: 200px;
    height: 35px;
  }

</style>