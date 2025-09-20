-- Inventory Test Suite
-- Tests for the inventory system performance

local Inventory = require("../inventory")

describe("Inventory", function()
    local inventory
    
    beforeEach(function()
        inventory = Inventory.new()
    end)
    
    describe("Performance", function()
        it("should handle large item counts efficiently", function()
            -- Add 100 items
            for i = 1, 100 do
                local item = {
                    id = i,
                    name = "Item " .. i,
                    rarity = { color = Color3.new(1, 1, 1) }
                }
                inventory:addItem(item)
            end
            
            -- Simulate frame update
            local startTime = tick()
            inventory:update(1/60)
            local endTime = tick()
            
            -- Should complete within reasonable time
            assert(endTime - startTime < 0.016, "Frame update took too long")
        end)
        
        it("should not create memory leaks", function()
            -- Add and remove items repeatedly
            for i = 1, 50 do
                local item = {
                    id = i,
                    name = "Item " .. i,
                    rarity = { color = Color3.new(1, 1, 1) }
                }
                inventory:addItem(item)
                inventory:removeItem(i)
            end
            
            -- UI elements should be cleaned up
            assert(#inventory.uiElements == 0, "UI elements not cleaned up")
        end)
    end)
    
    describe("Functionality", function()
        it("should add items correctly", function()
            local item = {
                id = 1,
                name = "Test Item",
                rarity = { color = Color3.new(1, 0, 0) }
            }
            
            local success = inventory:addItem(item)
            assert(success, "Failed to add item")
            assert(#inventory.items == 1, "Item count incorrect")
        end)
        
        it("should remove items correctly", function()
            local item = {
                id = 1,
                name = "Test Item",
                rarity = { color = Color3.new(1, 0, 0) }
            }
            
            inventory:addItem(item)
            local success = inventory:removeItem(1)
            
            assert(success, "Failed to remove item")
            assert(#inventory.items == 0, "Item count not zero after removal")
        end)
        
        it("should respect capacity limits", function()
            -- Fill inventory to capacity
            for i = 1, 100 do
                local item = {
                    id = i,
                    name = "Item " .. i,
                    rarity = { color = Color3.new(1, 1, 1) }
                }
                inventory:addItem(item)
            end
            
            -- Try to add one more
            local extraItem = {
                id = 101,
                name = "Extra Item",
                rarity = { color = Color3.new(1, 1, 1) }
            }
            
            local success = inventory:addItem(extraItem)
            assert(not success, "Should not exceed capacity")
            assert(#inventory.items == 100, "Should maintain capacity limit")
        end)
    end)
end)
