<template>
  <div class="subject">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card >
          <img class="thumbnail" :src="subject.pic">
        </el-card>
      </el-col>
      <el-col :span="17">
        <div class="grid-content bg-purple">{{subject.content}}</div>
        <div class="footer">
          <i class="el-icon-view">{{ subject.readCount}}</i>
          <i class="el-icon-s-promotion">{{subject.forwardCount}}</i>
          <i class="el-icon-star-on">{{ subject.collectCount }}</i>
          <i class="el-icon-chat-square primary">{{ subject.commentCount }}</i>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ["subject"],
  name: "subject"
}
</script>

<style lang="scss" scoped>
.subject{
  width: 100%;
  height: 200px;
  margin: 33px;
}
.footer{
  position: absolute;
  max-width: 300px;
  margin-top: 10px;
  bottom: 0;
}
.footer i{
 margin: 10px;
}
.thumbnail{
  width: 300px;
  height: 200px;
}
.el-row {
  margin-bottom: 20px;
&:last-child {
   margin-bottom: 0;
 }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  height: 170px;
  width: 100%;
  border-radius: 4px;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 9;
  -webkit-box-orient: vertical;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>