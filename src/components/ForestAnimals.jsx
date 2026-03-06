import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimalCharacter from './AnimalCharacter';
import { getUnlockedAnimals, getNewAnimal } from '../data/forestAnimals';

/**
 * 森林動物展示條 — 遊戲中顯示已解鎖的動物（帶表情反應）
 */
export function AnimalStrip({ level, grade, mood }) {
    const animals = getUnlockedAnimals(level);

    if (animals.length === 0) return null;

    return (
        <div className="animal-strip">
            <AnimatePresence>
                {animals.map((animal, i) => (
                    <motion.div
                        key={animal.id}
                        className="animal-slot"
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{
                            delay: i * 0.06,
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                        }}
                    >
                        <div className={`animal-char-wrap ${mood === 'happy' || mood === 'excited' ? 'animal-bounce' :
                                mood === 'sad' ? 'animal-shake' : ''
                            }`}>
                            <AnimalCharacter
                                type={animal.id}
                                mood={mood || 'normal'}
                                grade={grade}
                            />
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
    const newAnimal = getNewAnimal(level);
    const allAnimals = getUnlockedAnimals(level);

    return (
        <div className="levelup-animals">
            {/* 新夥伴 */}
            {newAnimal && (
                <>
                    <p className="levelup-animals-title">
                        🌲 新夥伴加入森林！
                    </p>
                    <motion.div
                        className="levelup-new-animal"
                        initial={{ scale: 0, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{
                            delay: 0.3,
                            type: 'spring',
                            stiffness: 200,
                            damping: 15,
                        }}
                    >
                        <div className="animal-char-wrap animal-bounce" style={{ width: 100, height: 100 }}>
                            <AnimalCharacter
                                type={newAnimal.id}
                                mood="happy"
                                grade={grade}
                            />
                        </div>
                        <span className="levelup-animal-name">{newAnimal.name}</span>
                    </motion.div>
                </>
            )}

            {/* 全部已收集（小顯示） */}
            {allAnimals.length > 1 && (
                <div className="levelup-all-animals">
                    <p className="levelup-collection-label">
                        🌳 我的森林 ({allAnimals.length}/7)
                    </p>
                    <div className="levelup-mini-animals">
                        {allAnimals.map((animal) => (
                            <div key={animal.id} className="animal-mini-wrap">
                                <AnimalCharacter
                                    type={animal.id}
                                    mood="happy"
                                    grade={grade}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
