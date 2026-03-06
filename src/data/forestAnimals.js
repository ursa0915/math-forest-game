/**
 * 森林動物資料 — 收集系統配置
 */

// 7 隻森林動物
export const FOREST_ANIMALS = [
    { id: 'bear', emoji: '🐻', name: '小熊', color: '#A0522D' },
    { id: 'rabbit', emoji: '🐰', name: '兔子', color: '#F9A8D4' },
    { id: 'dog', emoji: '🐶', name: '小狗', color: '#FBBF24' },
    { id: 'cat', emoji: '🐱', name: '貓咪', color: '#FB923C' },
    { id: 'bird', emoji: '🐦', name: '小鳥', color: '#38BDF8' },
    { id: 'horse', emoji: '🐴', name: '小馬', color: '#A78BFA' },
    { id: 'monkey', emoji: '🐵', name: '猴子', color: '#F87171' },
];

// 每個等級解鎖的動物 index 範圍
// LV1→2: index 0,1 | LV2→3: index 2,3 | LV3→4: index 4,5 | LV4→5: index 6
export function getUnlockedAnimals(level) {
    if (level <= 1) return [];
    const count = Math.min((level - 1) * 2, FOREST_ANIMALS.length);
    return FOREST_ANIMALS.slice(0, count);
}

// 升級時新解鎖的動物
export function getNewAnimals(level) {
    if (level <= 1) return [];
    const prevCount = Math.min((level - 2) * 2, FOREST_ANIMALS.length);
    const newCount = Math.min((level - 1) * 2, FOREST_ANIMALS.length);
    if (newCount <= prevCount) return [];
    return FOREST_ANIMALS.slice(prevCount, newCount);
}

// 年級配件配置
export const GRADE_ACCESSORIES = {
    1: [],                                    // 無配件
    2: ['🎀'],                                // 蝴蝶結
    3: ['🎀', '🧣'],                          // 蝴蝶結 + 圍巾
    4: ['🎩', '🧣'],                          // 帽子 + 圍巾
    5: ['👑', '🧣', '⭐'],                    // 皇冠 + 圍巾 + 星星
    6: ['👑', '🦸', '⭐', '💎'],              // 皇冠 + 披風 + 星星 + 寶石
};

// 配件位置 CSS class 對照
export const ACCESSORY_POSITIONS = {
    '🎀': 'acc-top-right',
    '🧣': 'acc-bottom',
    '🎩': 'acc-top',
    '👑': 'acc-top',
    '⭐': 'acc-top-left',
    '🦸': 'acc-bottom-left',
    '💎': 'acc-top-right',
};
