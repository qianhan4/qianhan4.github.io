const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

        // 让 canvas 充满屏幕
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let scale = 1; // 缩放比例
        let translateX = 0, translateY = 0;
        let lastX, lastY;
        let isDragging = false;

        //  10 张图片
        const islandImages = [
            "America.png", "argentina.png", "austria.png", "china.png", "england.png",
            "france.png", "germany.png", "Indian.png", "japan.png", "russia.png"
        ];

        const islands = [];

        function isOverlapping(x, y, size) {
            return islands.some(island => {
                const dx = island.x - x;
                const dy = island.y - y;
                return Math.sqrt(dx * dx + dy * dy) < size * 2; // 岛屿距离
            });
        }

        // 🎯 生成岛屿（图片）位置
        islandImages.forEach((src) => {
            let x, y, size = 400; // 图片大小
            do {
                x = Math.random() * canvas.width * 1.5 - canvas.width * 0.25; 
                y = Math.random() * canvas.height * 1.5 - canvas.height * 0.25; 
            } while (isOverlapping(x, y, size));

            const img = new Image();
            img.src = src;
            islands.push({ img, x, y, size });
        });

        // 🌍 绘制地图
        function drawMap() {
            ctx.setTransform(scale, 0, 0, scale, translateX, translateY);
            ctx.clearRect(-translateX / scale, -translateY / scale, canvas.width / scale, canvas.height / scale);

            islands.forEach(island => {
                ctx.drawImage(island.img, island.x, island.y, island.size, island.size);
            });
        }

        // 🔍 滚轮缩放
        // canvas.addEventListener("wheel", (event) => {
        //     event.preventDefault();
            
        //     let scaleAmount = event.deltaY * -0.001;
        //     let newScale = scale + scaleAmount;
        //     if (newScale < 0.5) newScale = 0.5;
        //     if (newScale > 2.5) newScale = 2.5;

        //     scale = newScale;
        //     drawMap();
        // });

        // ✋ 拖动地图
        canvas.addEventListener("mousedown", (event) => {
            isDragging = true;
            lastX = event.clientX;
            lastY = event.clientY;
        });

        canvas.addEventListener("mousemove", (event) => {
            if (isDragging) {
                let dx = event.clientX - lastX;
                let dy = event.clientY - lastY;
                translateX += dx;
                translateY += dy;
                lastX = event.clientX;
                lastY = event.clientY;
                drawMap();
            }
        });

        canvas.addEventListener("mouseup", () => isDragging = false);
        canvas.addEventListener("mouseleave", () => isDragging = false);

        // 📱 触摸屏缩放支持
        let touchDistance = null;

        canvas.addEventListener("touchstart", (event) => {
            if (event.touches.length === 2) {
                touchDistance = Math.hypot(
                    event.touches[0].pageX - event.touches[1].pageX,
                    event.touches[0].pageY - event.touches[1].pageY
                );
            }
        });

        canvas.addEventListener("touchmove", (event) => {
            if (event.touches.length === 2) {
                event.preventDefault();

                let newDistance = Math.hypot(
                    event.touches[0].pageX - event.touches[1].pageX,
                    event.touches[0].pageY - event.touches[1].pageY
                );

                if (touchDistance) {
                    let scaleAmount = (newDistance - touchDistance) * 0.005;
                    let newScale = scale + scaleAmount;

                    if (newScale < 0.5) newScale = 0.5;
                    if (newScale > 2.5) newScale = 2.5;

                    scale = newScale;
                }

                touchDistance = newDistance;
                drawMap();
            }
        });

        canvas.addEventListener("touchend", () => touchDistance = null);

        // 🔄 初始化绘制
        window.onload = drawMap;