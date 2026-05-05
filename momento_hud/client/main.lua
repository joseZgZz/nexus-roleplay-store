local QBCore = exports['qb-core']:GetCoreObject()
local PlayerData = {}
local isLoggedIn = false
local inVehicle = false
local hudVisible = true

-- Initialize
RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    PlayerData = QBCore.Functions.GetPlayerData()
    isLoggedIn = true
    ToggleHud(true)
    SetupRoundMinimap()
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    PlayerData = {}
    isLoggedIn = false
    ToggleHud(false)
end)

RegisterNetEvent('QBCore:Client:OnJobUpdate', function(JobInfo)
    PlayerData.job = JobInfo
end)

RegisterNetEvent('QBCore:Player:SetPlayerData', function(val)
    PlayerData = val
end)

-- HUD Toggle
function ToggleHud(state)
    hudVisible = state
    SendNUIMessage({
        action = state and "show" or "hide"
    })
end

-- Wait until loaded
CreateThread(function()
    while not QBCore do Wait(100) end
    if LocalPlayer.state.isLoggedIn then
        PlayerData = QBCore.Functions.GetPlayerData()
        isLoggedIn = true
        ToggleHud(true)
        SetupRoundMinimap()
    end
end)

-- Main HUD Loop (Player status & money)
CreateThread(function()
    while true do
        Wait(500)
        if isLoggedIn and hudVisible then
            local ped = PlayerPedId()
            
            -- Health & Armor
            local health = GetEntityHealth(ped) - 100
            if health < 0 then health = 0 end
            local maxHealth = GetEntityMaxHealth(ped) - 100
            local armor = GetPedArmor(ped)
            
            local healthPercentage = (health / maxHealth) * 100
            
            -- Hunger & Thirst (From MetaData in QBCore)
            local hunger = PlayerData.metadata and PlayerData.metadata["hunger"] or 100
            local thirst = PlayerData.metadata and PlayerData.metadata["thirst"] or 100

            -- Money & Job & Name
            local cash = 0
            local bank = 0
            if PlayerData.money then
                cash = PlayerData.money['cash'] or 0
                bank = PlayerData.money['bank'] or 0
            end

            local jobName = "Desempleado"
            if PlayerData.job and PlayerData.job.label then
                jobName = PlayerData.job.label .. " - " .. PlayerData.job.grade.name
            end

            local fullName = "Nombre Apellido"
            if PlayerData.charinfo then
                fullName = PlayerData.charinfo.firstname .. " " .. PlayerData.charinfo.lastname
            end

            local playerId = GetPlayerServerId(PlayerId())

            SendNUIMessage({
                action = "updatePlayerHUD",
                playerInfo = {
                    name = fullName,
                    id = playerId,
                    job = jobName,
                    cash = cash,
                    bank = bank
                },
                status = {
                    health = healthPercentage,
                    armor = armor,
                    hunger = hunger,
                    thirst = thirst
                }
            })
        end
    end
end)

-- Fast UI Loop (Vehicle & Compass)
CreateThread(function()
    while true do
        Wait(50) -- Faster update for speedometer & compass
        if isLoggedIn and hudVisible then
            local ped = PlayerPedId()
            
            -- Compass Heading
            local heading = GetEntityHeading(ped)
            -- Convert heading to standard compass degrees (GTA heading has 0 as North, but runs counter-clockwise. NUI expects standard clockwise, though usually heading 360 - GTAHeading is needed. Wait, in GTA 0 = North, 90 = West, 180 = South, 270 = East. Standard compass is 90 = East, 270 = West. Let's do 360 - heading)
            local compassHeading = 360.0 - heading
            if compassHeading >= 360.0 then compassHeading = compassHeading - 360.0 end
            
            SendNUIMessage({
                action = "updateCompass",
                heading = compassHeading
            })
            
            if IsPedInAnyVehicle(ped, false) and not IsPedOnAnyBike(ped) then
                local vehicle = GetVehiclePedIsIn(ped, false)
                local speed = math.ceil(GetEntitySpeed(vehicle) * 3.6) -- KM/H
                local gear = GetVehicleCurrentGear(vehicle)
                local rpm = GetVehicleCurrentRpm(vehicle)
                local fuel = exports['LegacyFuel']:GetFuel(vehicle) or GetVehicleFuelLevel(vehicle)
                
                SendNUIMessage({
                    action = "updateVehicleHUD",
                    inVehicle = true,
                    vehicle = {
                        speed = speed,
                        gear = gear,
                        rpm = rpm,
                        fuel = fuel
                    }
                })
                
                -- Ensure map is visible while in vehicle
                DisplayRadar(true)
            else
                SendNUIMessage({
                    action = "updateVehicleHUD",
                    inVehicle = false
                })
                -- Optionally hide radar when not in vehicle
                -- DisplayRadar(false) 
            end
        else
            Wait(1000)
        end
    end
end)

-- Setup Round Minimap
function SetupRoundMinimap()
    -- Clip type 1 natively converts the standard map clipping to a circle bounds
    SetMinimapClipType(1)

    -- Reposition Minimap slightly to fit CSS outline
    SetMinimapComponentPosition("minimap", "L", "B", 0.015, -0.03, 0.16, 0.16)
    SetMinimapComponentPosition("minimap_mask", "L", "B", 0.020, 0.012, 0.111, 0.159)
    SetMinimapComponentPosition('minimap_blur', 'L', 'B', -0.01, -0.01, 0.2, 0.24)

    -- Force minimap update
    DisplayRadar(false)
    Wait(500)
    DisplayRadar(true)
    SetBlipAlpha(GetNorthRadarBlip(), 0) -- Hide N blip so it doesn't look ugly on round map
end
