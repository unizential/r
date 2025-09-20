-- Inventory System (Performance Hotspot)
-- This is a sample file for Council analysis

local Inventory = {}
Inventory.__index = Inventory

-- Constructor
function Inventory.new()
    local self = setmetatable({}, Inventory)
    self.items = {}
    self.capacity = 100
    self.uiElements = {}
    return self
end

-- PERFORMANCE ISSUE: Updates every frame
function Inventory:update(deltaTime)
    -- Per-frame iteration over all items
    for i, item in ipairs(self.items) do
        if item.needsUpdate then
            self:updateItemUI(item)
            item.needsUpdate = false
        end
    end
    
    -- Expensive hover detection
    for _, uiElement in pairs(self.uiElements) do
        if self:isHovered(uiElement) then
            self:showTooltip(uiElement)
        end
    end
end

-- Add item (triggers UI update)
function Inventory:addItem(item)
    if #self.items >= self.capacity then
        return false
    end
    
    table.insert(self.items, item)
    item.needsUpdate = true
    self:createUIElement(item)
    return true
end

-- Remove item
function Inventory:removeItem(itemId)
    for i, item in ipairs(self.items) do
        if item.id == itemId then
            table.remove(self.items, i)
            self:destroyUIElement(item)
            return true
        end
    end
    return false
end

-- UI Management (expensive operations)
function Inventory:updateItemUI(item)
    -- Simulate expensive UI operations
    local uiElement = self.uiElements[item.id]
    if uiElement then
        uiElement.Text = item.name
        uiElement.BackgroundColor3 = item.rarity.color
        -- Force layout recalculation
        uiElement.Size = UDim2.new(0, 100, 0, 100)
    end
end

function Inventory:createUIElement(item)
    -- Create UI element for item
    local element = Instance.new("Frame")
    element.Name = "Item_" .. item.id
    element.Size = UDim2.new(0, 100, 0, 100)
    self.uiElements[item.id] = element
end

function Inventory:destroyUIElement(item)
    local element = self.uiElements[item.id]
    if element then
        element:Destroy()
        self.uiElements[item.id] = nil
    end
end

function Inventory:isHovered(element)
    -- Placeholder hover detection
    return false
end

function Inventory:showTooltip(element)
    -- Placeholder tooltip
end

return Inventory
