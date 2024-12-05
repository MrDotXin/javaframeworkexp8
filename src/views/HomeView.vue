
<template>
  <div class="home">
    <div class="header">
      <div class="header-box">
        <h1 style="text-align: left; margin: 15px;">管理</h1>
        <span class="user_account">
          <el-link :href="`/profile/${loginUser.id}`" type="primary">
            <span style="font-size: medium; font-weight: bold">{{ loginUser.id }} | {{ loginUser.name }}</span>
          </el-link>
        </span>
      </div>
    </div>
  </div>
  <div class="content">
    <el-divider />
    <el-table
    v-loading="loading"
    :data="userLists"
    style="width: 90%; margin: auto;"
    border
    stripe
    >
      <el-table-column fixed prop="id" label="学号" width="300" />
      <el-table-column prop="name" label="姓名" width="300" />
      <el-table-column fixed="right" label="管理" min-width="120">
        <template #default="scope">
          <el-button type="primary" size="small" @click="onDrawer(scope.row.id, scope.row.name, scope.$index)">
            修改
          </el-button> 
          <el-popconfirm
            width="220"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="确定要删除该用户吗?"
            :hide-after= 0
            @cancel="onCancel"
            @confirm="onDeleteStudent(scope.row.id, scope.row.name, scope.$index)"
          >
            <template #reference>
              <el-button plain type="danger" size="small">删除</el-button>
            </template> 
            <template #actions="{ cancel,confirm }">
              <el-button size="small" @click="cancel">不是</el-button>
              <el-button
                type="danger"
                size="small"
                @click="confirm"
              >
                确定
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-divider />

    <div style="margin: 5vh; display: flex; justify-content: center;">
        <div class="studentIdInput">
          <span style="font-size: 15px;">学号: </span> 
          <el-input id="id" type="text" style="width: 15vw; padding-left: 1vw; height: 4vh;" clearable v-model="addingForm.id"/>
        </div>
        <div class="studentNameInput" style="padding-left: 2vw;">
          <span style="font-size: 15px;">姓名: </span>
          <el-input id="name" type="text" style="width: 15vw; padding-left: 1vw; height: 4vh;" clearable v-model="addingForm.name"/> 
        </div>
        <button class="primary" style="margin-left: 2vw; width: 9vw;" @click="onAddStudent(addingForm.id, addingForm.name)">添加学生</button>
      </div>
  </div>

  <el-drawer
    v-model="open_drawer"
    title="修改用户信息"
    direction="ltr"
    class="user_info_editor"
    :show-close="true"
    size="35%"
  > 
    <el-divider />
    <div class="fixed_info" style="margin-bottom: 2vh;">
      <el-row style="text-align: center">
        <el-text style="margin: auto;" type="info" size="large" class="w-150px" truncated >
          学号: {{ oldInfo.id }} 
        </el-text>
      </el-row>
      <el-row>
        <el-text style="margin: auto; margin-top: 1vh" type="info" size="large" class="w-150px" truncated > 
          姓名: {{ oldInfo.name }} 
        </el-text>
      </el-row>
    </div>
    <el-form 
      ref="changingUserRef"
      :model="changingInfo" 
      label-width="auto"
      :rules="rulers"
      status-icon
      >
      <el-form-item label="学号" label-width="80px" prop="id">
        <el-input v-model="changingInfo.id" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="姓名" label-width="80px" prop="name">
        <el-input v-model="changingInfo.name" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button @click="open_drawer = false;">取消</el-button>
          <el-button type="primary" :loading="on_submit_loading" @click="onSubmitUpateUserInfo(changingUserRef)">
            {{ on_submit_loading ? '正在提交中...' : '提交' }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
// @ is an alias to /src
import { onBeforeMount, ref, reactive } from 'vue';
import userService from '@/apiService/user/userService';
import User from '@/model/User';
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus' 
import { InfoFilled } from '@element-plus/icons-vue'
export default {
  name: 'HomeView',
  components: {
    
  },
  setup() {

    const router = useRouter();

    const userLists = ref();

    const addingForm = ref(User());

    const clicked = ref(false)
    function onCancel() {
      clicked.value = true
    }
    
    const loginUser = ref(User('未登录', '未登录'));
    const loading = ref(true);
    onBeforeMount(async () => {
      loading.value = true;
      let userInfo = await userService.GetLoginUser();
      if (userInfo.code) {
        ElMessageBox.alert("未登录!", "错误", {
          confirmButtonClass: "去登录",
          callback: () => {
            ElMessage({
              type: 'success',
              message: "跳转: 登录界面"
            })
            router.push('/login');
          }
        });
        return;
      }
      
      loginUser.value = userInfo.data;
      
      let list = await userService.GetUserList();
      console.log("得到后台数据 : ", list);
      
      if (list instanceof Array) {
        userLists.value = list;
      } else {
        alert(list.message);
      }
      loading.value = false;
    });
    
    async function onAddStudent(id, name) {
      if (!id) {
        alert("id 不得为空!");
      } else {
        let response = await userService.AddUser(User(id, name));
        if (response.code) {
          ElMessage({
            type: "error",
            message: `添加失败! ${response.message}`
          });
        } else {
          userLists.value.push(User(id, name));
          ElMessage({
            type: "success",
            message: `添加成功! ${name}`
          });
          addingForm.value.id = addingForm.value.name = '';
        }
      }
    }

    async function onDeleteStudent(id, name, index) {
      console.log(id, name, index);
      let list = userLists.value;
      let response = await userService.DeleteUser(User(id, name));
      if (response.code) {
        ElMessage({
          type: "error",
          message: `删除失败 ! ${response.message}`
        });
      } else {
        ElMessage({
          type: "success",
          message: `删除成功 ! ${response.message}`
        });
        list.splice(index, 1);
      }
    }

    const changingInfo = ref(User());
    const oldInfo = ref(User());
    const open_drawer = ref(false);
    let editIndex = 0;
    function onDrawer(id, name, index) { 
      open_drawer.value = true;
      oldInfo.value = User(id, name);
      changingInfo.value = User(id, name);
      editIndex = index;
    }
    
    
    const on_submit_loading = ref(false);
    const changingUserRef = ref();

    const rulers = reactive({
      id: [
        { required: true, message: "学号不得为空", trigger: 'blur' }
      ],
      name: [
        { required: true, message: "姓名不得为空", trigger: 'blur' }
      ]
    });

    async function onSubmitUpateUserInfo(changingUserRef) {
      on_submit_loading.value = true;
      let ok = false; 
      do {
        if (!changingUserRef) {          
          break;
        }

        await changingUserRef.validate(async (valid, fields) => {
          console.log(fields);
          let response = false;
          if (valid) {
            response = await userService.UpdateUser(oldInfo.value, changingInfo.value);
          }

          if (valid && response && !response.code) {
            await sleep(300);
            userLists.value[editIndex] = changingInfo.value;
            ElMessage({
              type: 'success',
              message: "修改成功!",
              duration: 3000
            });
            ok = true;
          } else {
            ElMessage({
              type: 'error',
              message: `修改失败! ${response ? response.message : ""}`,
              duration: 3000
            });
          }
        });
        
      } /*eslint-disable no-constant-condition*/ while (false);

      open_drawer.value = !ok;
      on_submit_loading.value = false;
    }


    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    return {
      userLists,
      addingForm,
      loginUser,
      clicked,
      loading,
      open_drawer,
      changingInfo,
      oldInfo,
      on_submit_loading,
      rulers,
      changingUserRef,
      InfoFilled,
      onAddStudent,
      onDeleteStudent,
      onDrawer,
      onCancel,
      onSubmitUpateUserInfo,
    }
  }
}
</script>

<style scoped src="@/views/views_style_sheet/HomeView/triggleBtn.css" /> 
<style scoped>

.header-box {
  display: flex;
  /* flex-direction: row; */

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

.header-box .user_account {
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  padding: 4vh;
}

.content {
  margin-top: 13vh;
}
</style>
