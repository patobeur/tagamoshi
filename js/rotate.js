
let go = () => {
    let size = { w: 20, h: 20 }
    let animateInterval = 20
    let speed = 5
    let stepcolor = 3
    let hue = 0;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let touchPositions = [];

    function updateMousePosition(event) {
        if (event.type === "mousemove") {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        } else if (event.type === "touchmove") {
            const touches = event.touches;
            touchPositions = [];

            for (let i = 0; i < touches.length; i++) {
                touchPositions.push({ x: touches[i].clientX, y: touches[i].clientY });
            }

            if (touchPositions.length > 0) {
                const averageX = touchPositions.reduce((acc, touch) => acc + touch.x, 0) / touchPositions.length;
                const averageY = touchPositions.reduce((acc, touch) => acc + touch.y, 0) / touchPositions.length;
                mouse.x = averageX;
                mouse.y = averageY;
            }
        }
    }
    // document.addEventListener('mousemove', (e) => {
    //     mouse.x = e.clientX;
    //     mouse.y = e.clientY;
    // })
    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('touchmove', updateMousePosition, { passive: false });

    function rand(min, max) { return Math.floor(Math.random() * (max - min + 1) + min) }
    function get_DegreeWithTwoPos(x, y, X, Y) { return (Math.atan2(Y - y, X - x) * 180) / Math.PI; }
    function addCss() {
        let stringcss = `` +
            `*,::before,::after{margin:0;padding:0;box-sizing:border-box;}` +
            `body {background-color: #102030;overflow: hidden;}` +
            `` +
            `.mob{text-align:center;width:${size.w}px;height:${size.h}px;background-color:rgba(0,255,50,.8);user-select: none;color: white;box-shadow: 0 0 7px 4px rgb(0,0,0);}`;
        let style = document.createElement("style");
        style.textContent = stringcss;
        style.id = "css";
        document.getElementsByTagName("head")[0].appendChild(style);
    };
    function createnewmob() {
        let mob = document.createElement('div');
        mob.datas = {
            minDist: 20,
            lookAt: { x: mouse.x, y: mouse.y },
            count: 0,
            x: rand(size.w + 5, window.innerWidth - size.w + 5),
            y: rand(size.h + 5, window.innerHeight - size.h + 5),
            speed: speed,
            rotateValue: 0,
            init: null,
            hue: hue,
            create: function (number) {
                mob.style.position = "absolute";
                mob.className = "mob";
                mob.textContent = "..";
                // ------------------------------------- 
                mob.style.left = mob.datas.x + 'px'
                mob.style.top = mob.datas.y + 'px'
                // ------------------------------------- 
                mob.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
                hue = (hue + stepcolor) % 360;
                // ------------------------------------- 
                // mob.datas.rotateValue = 0;
                // mob.style.transform = `rotate(${mob.datas.rotateValue - 90}deg)`;
                // ------------------------------------- 
                document.body.appendChild(mob)
                mob.datas.startAnimation()
            },
            startAnimation: function () {
                mob.datas.init = setInterval(() => {
                    mob.datas.animate();
                }, animateInterval)
            },
            animate: function () {
                mob.datas.lookAt = { x: mouse.x, y: mouse.y }
                mob.datas.rotateValue = get_DegreeWithTwoPos(mob.datas.x, mob.datas.y, mob.datas.lookAt.x, mob.datas.lookAt.y) + rand(-2, 2);
                mob.datas.x = (mob.datas.x + Math.cos(mob.datas.rotateValue * (Math.PI / 180)) * mob.datas.speed);
                mob.datas.y = (mob.datas.y + Math.sin(mob.datas.rotateValue * (Math.PI / 180)) * mob.datas.speed);
                // ------------------------------------- 
                mob.style.transform = `rotate(${mob.datas.rotateValue - 90}deg)`;
                mob.style.left = mob.datas.x + 'px'
                mob.style.top = mob.datas.y + 'px'
                // -------------------------------------
                const distance = Math.sqrt(Math.pow(mob.datas.x - mob.datas.lookAt.x, 2) + Math.pow(mob.datas.y - mob.datas.lookAt.y, 2));
                // -------------------------------------
                if (distance < mob.datas.minDist) {
                    clearInterval(mob.datas.init);
                    mob.datas.die()
                }
            },
            die: function () {
                document.body.removeChild(mob)
                createnewmob()
            },
        }
        mob.datas.create()
    }
    // -------------------------------------
    addCss();
    // -------------------------------------
    for (let i = 0; i < 20; i++) {
        createnewmob()
    }
};
window.addEventListener("DOMContentLoaded", () => {
    go();
})