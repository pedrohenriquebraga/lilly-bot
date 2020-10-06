const menuIcon = document.querySelector('header i')
const header = document.querySelector('header')

function toggleNav() { 
    header.classList.toggle('nav')
        if (header.classList.contains('nav')) { 
            menuIcon.classList.remove('fa-bars')
            menuIcon.classList.add('fa-times')
        } else {
            menuIcon.classList.add('fa-bars')
            menuIcon.classList.remove('fa-times')
        }
    }
menuIcon.addEventListener('click', toggleNav)