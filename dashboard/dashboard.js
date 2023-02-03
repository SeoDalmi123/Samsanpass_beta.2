
//sidebar
let sidebar = document.querySelector(".sidebarcontainer");
let button = document.querySelector(".toggle");
let home = document.querySelector("#main");
button.addEventListener("click", myFunction);

function myFunction(){
    sidebar.classList.toggle("close");
    home.classList.toggle("open");
}
//navigation control
const tabs = document.querySelectorAll('[data-tab-target]')
const tabsContent = document.querySelectorAll('[data-tab-content]')

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = document.querySelector(tab.dataset.tabTarget)
        const bground = document.getElementById('bground')
        tabsContent.forEach(tabsContent => {
            tabsContent.classList.remove('active')
        })
        tabs.forEach(tab => {
            tab.classList.remove('active')
        })
        bground.classList.add('inactive')
        target.classList.add('active')
        tab.classList.add('active')
    })
})
//darkmode
const themeToggler = document.querySelector("#theme-toggler");
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');

    let nightmode = document.querySelector(".bxs-moon");
    let lightmode = document.querySelector(".bx-sun");

    if(lightmode.style.display === "block"){
        nightmode.style.display = "block";
        lightmode.style.display = "none";
    } else {
        nightmode.style.display = "none";
        lightmode.style.display = "block";
    }
});



