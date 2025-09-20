export interface EngineAdapter {
    id: 'roblox' | 'unity' | 'godot' | 'unreal';
    importProject(path: string): Promise<void>;
    applyPatch(diff: string): Promise<void>;
    runTests(): Promise<any>;
}
export declare class RobloxAdapter implements EngineAdapter {
    id: "roblox";
    importProject(path: string): Promise<void>;
    applyPatch(diff: string): Promise<void>;
    runTests(): Promise<any>;
}
export declare class UnityAdapter implements EngineAdapter {
    id: "unity";
    importProject(path: string): Promise<void>;
    applyPatch(diff: string): Promise<void>;
    runTests(): Promise<any>;
}
export declare class GodotAdapter implements EngineAdapter {
    id: "godot";
    importProject(path: string): Promise<void>;
    applyPatch(diff: string): Promise<void>;
    runTests(): Promise<any>;
}
export declare class UnrealAdapter implements EngineAdapter {
    id: "unreal";
    importProject(path: string): Promise<void>;
    applyPatch(diff: string): Promise<void>;
    runTests(): Promise<any>;
}
export declare function createEngineAdapter(engineId: EngineAdapter['id']): EngineAdapter;
