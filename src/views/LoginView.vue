<template>
  <div class="header">
    <div class="header-box">
      <h1 style="text-align: left; margin: 15px; cursor: pointer;" @click="router.go(0)">登录</h1>
    </div>
  </div>
  <div class="content">
    <div class="wrapper">
        <div class="card-switch">
            <label class="switch">
                <input type="checkbox" class="toggle">
                <span class="slider"></span>
                <span class="card-side"></span>
                <div class="flip-card__inner">
                  <div class="flip-card__front">
                    <div class="title">
                      <img src="@/assets/login.png" style="width: 40px; height: 40px; vertical-align: middle;"/>
                      <span style="vertical-align: middle;">登录</span>
                    </div>
                    
                      <div class="user_form">
                        <input class="flip-card__input" name="id" placeholder="学号" v-model="form.id">
                        <input class="flip-card__input" name="name" placeholder="姓名" v-model="form.name">
                        <button class="flip-card__btn" @click="onLogin(form.id, form.name)">登录</button>
                      </div>
                  </div>
                  <div class="flip-card__back">
                      <div class="title">
                      <img src="@/assets/register.png" style="width: 40px; height: 40px; vertical-align: middle;"/>
                      <span style="vertical-align: middle;">注册</span>
                    </div>
                      <div class="user_form">
                        <input class="flip-card__input" name="id" placeholder="学号">
                        <input class="flip-card__input" name="name" placeholder="姓名">
                        <button class="flip-card__btn">注册</button>
                      </div>
                  </div>
                </div>
            </label>
        </div>   
    </div>
  </div>
</template>

<script>
  
  import { ref } from 'vue';
  import userService from '@/apiService/user/userService';
  import User from '@/model/User';
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus' 

  export default {
    components: {
    },

    setup() {
      const router = useRouter(); 
      const form = ref(User());

      async function onLogin(id, name) {
          console.log(id, name);
          let response = await userService.CheckLogin(User(id, name));
          if (response.code) {  
            ElMessage({
              type: "error",
              duration: 3000,
              message: `登陆失败 ! ${response.message}`
            });
          } else {
            console.log(response.code, response.message);
            ElMessage({
              type: 'success',
              message: `登陆成功, 欢迎 ${name} !`,
              duration: 4000
            });

            router.push('/home');
          }
      }

      return {
        form,
        router,
        onLogin,
      }

    }
  };

</script>

<style scoped src="@/views/views_style_sheet/LoginView/login_form.css" />
<style scoped>

.header-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 10vh;
  z-index: 1000;
  box-shadow: 0px 1px 3px 1px rgb(204, 204, 204, 0.56);
  border-width: 0px;
  border-style: solid;
  border-color: #000000;
}

</style>
