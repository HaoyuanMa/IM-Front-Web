<template>
  <nav>
    <div class="nav nav-tabs justify-content-center" id="nav-tab" role="tablist">
      <router-link class="nav-link"  data-toggle="tab"  role="tab"  aria-selected="false" to="/Register">Register</router-link>
      <router-link class="nav-link active"  data-toggle="tab"  role="tab"  aria-selected="true" to="/Login">Login</router-link>
      <router-link class="nav-link"  data-toggle="tab"  role="tab"  aria-selected="false" to="/Chat">Chat</router-link>
      <router-link class="nav-link"  data-toggle="tab"  role="tab"  aria-selected="false" to="/BroadcastHost">BroadcastHost</router-link>
      <router-link class="nav-link"  data-toggle="tab"  role="tab"  aria-selected="false" to="/BroadcastReceive">BroadcastReceive</router-link>
      <router-link class="nav-link"  data-toggle="tab"  role="tab"  aria-selected="false" to="/ChatRoom">ChatRoom</router-link>
      <router-link class="nav-link"  data-toggle="tab"  role="tab"  aria-selected="false" to="/Monitor">Monitor</router-link>
    </div>
  </nav>
  <router-view/>
</template>

<style>




</style>


<script>



  export default {
    name:"App"

  }
</script>
