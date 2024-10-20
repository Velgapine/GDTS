<template>
  <el-pagination
    v-if="!loading"
    v-model:currentPage="query.currentPage"
    v-model:page-size="query.size"
    class="pagination"
    :page-sizes="[15, 30, 50, 100, 200]"
    background
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  ></el-pagination>
</template>

<script lang="ts" setup>
const props = defineProps({
  listQuery: {
    type: Object,
    default() {
      return {
        currentPage: '',
        size: '',
      };
    },
  },
  loading: {
    type: Boolean,
    default: false,
  },
  getList: {
    type: Function,
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
});

// v-model不能操作props，因为props不可变
const query = reactive(props.listQuery);
const getList = reactive(props.getList);

const handleSizeChange = (pageSize: number) => {
  query.size = pageSize;
  getList();
};

const handleCurrentChange = (pageNum: number) => {
  query.currentPage = pageNum;
  getList();
};
</script>

<style lang="scss" scoped>
.pagination {
  margin: 20px 0;
}
</style>
