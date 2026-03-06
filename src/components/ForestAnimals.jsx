import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUnlockedAnimals, getNewAnimals, GRADE_ACCESSORIES, ACCESSORY_POSITIONS } from '../data/forestAnimals';

/**
 * 森林動物展示條 — 遊戲中顯示已解鎖的動物
 */
export function AnimalStrip({ level, grade }) {
    const animals = getUnlockedAnimals(level);
    const accessories = GRADE_ACCESSORIES[grade] || [];

    if (animals.length === 0) return null;

    return (
        <div className="animal-strip">
            <AnimatePresence>
                {animals.map((animal, i) => (
                    <motion.div
                        key={animal.id}
                        className="animal-slot"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            delay: i * 0.08,
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                        }}
                    >
                        <div
                            className="animal-circle"
                            style={{ '--animal-color': animal.color }}
                        >
                            <span className="animal-emoji">{animal.emoji}</span>
                            {accessories.map((acc, j) => (
                                <span
                                    key={j}
                                    className={`animal-accessory ${ACCESSORY_POSITIONS[acc] || 'acc-top'}`}
                                >
                                    {acc}
                                </span>
                            ))}
                        </div>
                        <span className="animal-name">{animal.name}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

/**
 * 升級彈窗內容 — 展示新解鎖的動物
 */
export function LevelUpAnimals({ level, grade }) {
    const newAnimals = getNewAnimals(level);
    const allAnimals = getUnlockedAnimals(level);
    const accessories = GRADE_ACCESSORIES[grade] || [];

    return (
        <div className="levelup-animals">
            {/* 新夥伴標題 */}
            {newAnimals.length > 0 && (
                <p className="levelup-animals-title">
                    🌲 新夥伴加入森林！
                </p>
            )}

            {/* 新解鎖的動物（大） */}
            <div className="levelup-new-animals">
                {newAnimals.map((animal, i) => (
                    <motion.div
                        key={animal.id}
                        className="levelup-new-animal"
                        initial={{ scale: 0, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{
                            delay: 0.3 + i * 0.2,
                            type: 'spring',
                            stiffness: 200,
                            damping: 15,
                        }}
                    >
                        <div
                            className="animal-circle animal-circle-lg"
                            style={{ '--animal-color': animal.color }}
                        >
                            <span className="animal-emoji">{animal.emoji}</span>
                            {accessories.map((acc, j) => (
                                <span
                                    key={j}
                                    className={`animal-accessory ${ACCESSORY_POSITIONS[acc] || 'acc-top'}`}
                                >
                                    {acc}
                                </span>
                            ))}
                        </div>
                        <span className="levelup-animal-name">{animal.name}</span>
                    </motion.div>
                ))}
            </div>

            {/* 全部已收集（小） */}
            {allAnimals.length > 2 && (
                <div className="levelup-all-animals">
                    <p className="levelup-collection-label">🌳 我的森林 ({allAnimals.length}/7)</p>
                    <div className="levelup-mini-animals">
                        {allAnimals.map((animal) => (
                            <div
                                key={animal.id}
                                className="animal-circle animal-circle-sm"
                                style={{ '--animal-color': animal.color }}
                            >
                                <span className="animal-emoji">{animal.emoji}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
