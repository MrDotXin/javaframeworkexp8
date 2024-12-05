<template>
    <div class="#app">
        <router-view/>
    </div>

    <div class="footer">
        <div class="line"></div>
        <div class="footer-content">Made by 221042Y234 毛梓进</div>
        <div>
            <a href="https://github.com/MrDotXin?tab=repositories" target="_blank">MrDotXin</a>
        </div>
    </div>  
</template>


<style scoped>

.footer { 
    position: sticky;
    margin-top: 100vh;
}   

.footer .line {
    border-top: 0.5px solid rgba(0, 0, 0, 0.38);
    width: 80vw;
    border-radius: 1px;
    box-shadow: 0px 1px 3px 1px rgb(204, 204, 204, 0.56);
    margin: auto;
}

.footer .footer-content {
    color: #868181;
}

</style>