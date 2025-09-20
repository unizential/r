-- Cache System (Referenced in Council Synthesis)
-- This file will be impacted by inventory improvements

local Cache = {}
Cache.__index = Cache

function Cache.new()
    local self = setmetatable({}, Cache)
    self.data = {}
    self.maxSize = 1000
    self.evictionPolicy = "lru"
    return self
end

function Cache:get(key)
    local item = self.data[key]
    if item then
        -- Update access time for LRU
        item.lastAccess = tick()
        return item.value
    end
    return nil
end

function Cache:set(key, value)
    if #self.data >= self.maxSize then
        self:evict()
    end
    
    self.data[key] = {
        value = value,
        lastAccess = tick(),
        created = tick()
    }
end

function Cache:evict()
    if self.evictionPolicy == "lru" then
        local oldestKey = nil
        local oldestTime = math.huge
        
        for key, item in pairs(self.data) do
            if item.lastAccess < oldestTime then
                oldestTime = item.lastAccess
                oldestKey = key
            end
        end
        
        if oldestKey then
            self.data[oldestKey] = nil
        end
    end
end

function Cache:clear()
    self.data = {}
end

function Cache:size()
    return #self.data
end

return Cache
