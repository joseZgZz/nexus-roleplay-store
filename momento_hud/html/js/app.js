$(document).ready(function () {
    // Generate Compass Strip
    let compassHtml = "";
    const directions = { 0: "N", 45: "NE", 90: "E", 135: "SE", 180: "S", 225: "SW", 270: "W", 315: "NW", 360: "N" };

    // Render enough ticks (0 to 720+ degrees) to wrap securely
    for (let i = -90; i <= 810; i += 15) {
        let deg = i;
        if (deg < 0) deg += 360;
        deg = deg % 360;

        if (directions[deg] !== undefined) {
            compassHtml += `<span class="tick cardinal">${directions[deg]}</span>`;
        } else {
            compassHtml += `<span class="tick line">|</span>`;
        }
    }
    $("#compassStrip").html(compassHtml);

    window.addEventListener('message', function (event) {
        let data = event.data;

        if (data.action === "show") {
            $("#app").fadeIn(300);
        } else if (data.action === "hide") {
            $("#app").fadeOut(300);
        } else if (data.action === "updatePlayerHUD") {
            // Update Player Info
            if (data.playerInfo) {
                $("#playerName").text(data.playerInfo.name);
                $("#playerId").text("#" + data.playerInfo.id);
                $("#playerJob").text(data.playerInfo.job);
                $("#cashAmount").text("$" + formatMoney(data.playerInfo.cash));
                $("#bankAmount").text("$" + formatMoney(data.playerInfo.bank));
            }

            // Update Status Circles
            if (data.status) {
                updateStatusCircle('health', data.status.health);
                updateStatusCircle('armor', data.status.armor);
                updateStatusCircle('hunger', data.status.hunger);
                updateStatusCircle('thirst', data.status.thirst);

                // Show/hide armor based on value
                if (data.status.armor <= 0) {
                    $("#armor").fadeOut(150);
                } else {
                    $("#armor").fadeIn(150);
                }
            }
        } else if (data.action === "updateVehicleHUD") {
            if (data.inVehicle) {
                $(".vehicle-hud").fadeIn(150);

                // Speed calculation (0 to maxSpeed for dashoffset)
                // Max dashoffset for semi-circle is approx 141 (circumference of r=40 is ~251, half is ~125. Actually, using 141 as max is from standard svg paths). 
                // Wait, precise calculation: r=40, Path length = ~ 125.6 
                // Let's use percentage. Path length = 125.6
                // offset = 125.6 - (125.6 * (speed / maxSpeed))

                let speed = data.vehicle.speed;
                let maxSpeed = 250; // default generic max speed
                let percentage = speed / maxSpeed;
                if (percentage > 1) percentage = 1;

                let offset = 125.6 - (125.6 * percentage);

                // Keep 3 digits
                let speedStr = speed.toString().padStart(3, '0');
                $("#speedNum").text(speedStr);

                // Update SVG progress
                $("#speedBar").css({
                    "stroke-dasharray": "125.6",
                    "stroke-dashoffset": offset
                });

                // Update Gear
                if (data.vehicle.gear === 0) {
                    $("#gearNum").text("R");
                } else if (speed === 0 && data.vehicle.gear === 1) {
                    $("#gearNum").text("N");
                } else {
                    $("#gearNum").text(data.vehicle.gear);
                }

                // Update Fuel
                $("#fuelNum").text(Math.round(data.vehicle.fuel) + "%");

                // RPM coloring (optional effect)
                if (data.vehicle.rpm > 0.8) {
                    $("#gearNum").css("color", "var(--secondary)");
                    $("#gearNum").css("text-shadow", "0 0 10px var(--secondary)");
                } else {
                    $("#gearNum").css("color", "var(--primary)");
                    $("#gearNum").css("text-shadow", "0 0 10px var(--primary)");
                }

            } else {
                $(".vehicle-hud").fadeOut(150);
            }
        } else if (data.action === "updateCompass") {
            let heading = data.heading; // 0 to 360

            // 1 degree = 2 pixels, as each 15 deg tick is 30px.
            // Start offset is applied because we rendered starting from -90 degrees.
            // -90 degrees is 6 ticks = 180px added to the left.
            // Normal shift is -(heading * 2). We must adjust by the -90 start offset.
            let offset = -(heading * 2) - 180;

            $("#compassStrip").css("transform", `translateX(${offset}px)`);
        }
    });

    function updateStatusCircle(id, value) {
        // SVG circle logic: dasharray="100, 100", value is percentage
        let percentage = value;
        if (percentage > 100) percentage = 100;
        if (percentage < 0) percentage = 0;

        // For standard HTML pie chart using SVG stroke-dasharray="value, 100"
        $("#" + id + " .progress").attr("stroke-dasharray", percentage + ", 100");
    }

    function formatMoney(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});
