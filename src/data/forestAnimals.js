/**
 * 森林動物資料 — 收集系統配置
 */

// 7 隻森林動物（對應 7 個等級）
export const FOREST_ANIMALS = [
    { id: 'bear', name: '小熊', color: '#A0522D' },
    { id: 'rabbit', name: '兔子', color: '#F9A8D4' },
    { id: 'dog', name: '小狗', color: '#FBBF24' },
    { id: 'cat', name: '貓咪', color: '#FB923C' },
    { id: 'bird', name: '小鳥', color: '#38BDF8' },
    { id: 'horse', name: '小馬', color: '#A78BFA' },
    { id: 'monkey', name: '猴子', color: '#F87171' },
];

// LV1 = 1 隻動物，每升一級 +1 隻
export function getUnlockedAnimals(level) {
    const count = Math.min(level, FOREST_ANIMALS.length);
    return FOREST_ANIMALS.slice(0, count);
}

// 升級時新解鎖的動物（只有 1 隻）
export function getNewAnimal(level) {
    const idx = level - 1;
    if (idx < 0 || idx >= FOREST_ANIMALS.length) return null;
    return FOREST_ANIMALS[idx];
}
