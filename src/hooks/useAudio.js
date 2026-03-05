import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * 音效引擎 — 使用 Web Audio API 合成所有音效與背景音樂
 * 不需要外部音檔，所有聲音皆為程式產生
 */

let globalAudioCtx = null;

function getAudioCtx() {
    if (!globalAudioCtx) {
        globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return globalAudioCtx;
}

function resumeAudioCtx() {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    return ctx;
}

// ─── 音效合成函式 ────────────────────────────────────

/**
 * 正確音效 — 歡快上升的叮咚聲
 */
function playCorrectSound(ctx, volume = 0.3) {
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    // 雙音叮咚（C5 → E5）
    const notes = [523.25, 659.25];
    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        osc.connect(gain);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.25);
    });

    // 加一個高八度泛音增加亮度
    const sparkle = ctx.createOscillator();
    sparkle.type = 'sine';
    sparkle.frequency.setValueAtTime(1318.5, now + 0.1);
    const sparkleGain = ctx.createGain();
    sparkleGain.connect(ctx.destination);
    sparkleGain.gain.setValueAtTime(volume * 0.15, now + 0.1);
    sparkleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    sparkle.connect(sparkleGain);
    sparkle.start(now + 0.1);
    sparkle.stop(now + 0.4);
}

/**
 * 錯誤音效 — 柔和的下降提示音
 */
function playWrongSound(ctx, volume = 0.2) {
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.4);
}

/**
 * 按鈕點擊音效 — 輕巧的彈跳聲
 */
function playClickSound(ctx, volume = 0.15) {
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.1);
}

/**
 * 升級音效 — 歡慶小號上行旋律
 */
function playLevelUpSound(ctx, volume = 0.25) {
    const now = ctx.currentTime;
    // C5 → E5 → G5 → C6 快速上行
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const dur = 0.15;

    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'square';
        const gain = ctx.createGain();
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(volume * 0.5, now + i * dur);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * dur + dur + 0.1);
        osc.frequency.setValueAtTime(freq, now + i * dur);
        osc.connect(gain);
        osc.start(now + i * dur);
        osc.stop(now + i * dur + dur + 0.1);

        // 同時加一個 sine 作為柔和底層
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        const gain2 = ctx.createGain();
        gain2.connect(ctx.destination);
        gain2.gain.setValueAtTime(volume * 0.3, now + i * dur);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + i * dur + dur + 0.15);
        osc2.frequency.setValueAtTime(freq, now + i * dur);
        osc2.connect(gain2);
        osc2.start(now + i * dur);
        osc2.stop(now + i * dur + dur + 0.15);
    });

    // 最後的閃亮結尾音
    const sparkle = ctx.createOscillator();
    sparkle.type = 'sine';
    const sparkleGain = ctx.createGain();
    sparkleGain.connect(ctx.destination);
    sparkleGain.gain.setValueAtTime(volume * 0.2, now + notes.length * dur);
    sparkleGain.gain.exponentialRampToValueAtTime(0.01, now + notes.length * dur + 0.5);
    sparkle.frequency.setValueAtTime(2093, now + notes.length * dur);
    sparkle.connect(sparkleGain);
    sparkle.start(now + notes.length * dur);
    sparkle.stop(now + notes.length * dur + 0.5);
}

/**
 * 連擊音效 — 快速的三連音 + 上揚
 */
function playComboSound(ctx, volume = 0.2) {
    const now = ctx.currentTime;
    const notes = [659.25, 783.99, 987.77]; // E5 → G5 → B5
    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        const gain = ctx.createGain();
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(volume, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        osc.connect(gain);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.2);
    });
}

// ─── 背景音樂（柔和循環旋律）────────────────────────

/**
 * 背景音樂引擎
 * 使用簡單的和弦進行 + 旋律音符循環播放
 */
class BGMEngine {
    constructor(ctx) {
        this.ctx = ctx;
        this.isPlaying = false;
        this.volume = 0.08; // 小聲
        this.masterGain = ctx.createGain();
        this.masterGain.connect(ctx.destination);
        this.masterGain.gain.setValueAtTime(this.volume, ctx.currentTime);
        this.scheduledNodes = [];
        this.loopTimer = null;
    }

    // 和弦進行: I → V → vi → IV (C大調: C → G → Am → F)
    // 每個和弦持續 2 秒，共 8 秒一個循環
    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this._playLoop();
    }

    _playLoop() {
        if (!this.isPlaying) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;

        // 和弦音符（低八度，柔和 pad）
        const chords = [
            [261.63, 329.63, 392.00],  // C: C4, E4, G4
            [196.00, 246.94, 293.66],  // G: G3, B3, D4
            [220.00, 261.63, 329.63],  // Am: A3, C4, E4
            [174.61, 220.00, 261.63],  // F: F3, A3, C4
        ];

        // 旋律音符（高八度，簡單且歡樂）
        const melodies = [
            [523.25, 587.33, 659.25, 587.33],   // C5, D5, E5, D5
            [392.00, 493.88, 523.25, 493.88],   // G4, B4, C5, B4
            [440.00, 523.25, 587.33, 523.25],   // A4, C5, D5, C5
            [349.23, 440.00, 523.25, 440.00],   // F4, A4, C5, A4
        ];

        const chordDuration = 2.0;

        chords.forEach((chord, chordIdx) => {
            const chordStart = now + chordIdx * chordDuration;

            // Pad 和弦（柔和的 sine）
            chord.forEach(freq => {
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, chordStart);
                const gain = ctx.createGain();
                gain.connect(this.masterGain);
                // 柔和的 fade in/out
                gain.gain.setValueAtTime(0.01, chordStart);
                gain.gain.linearRampToValueAtTime(0.6, chordStart + 0.3);
                gain.gain.linearRampToValueAtTime(0.4, chordStart + chordDuration - 0.3);
                gain.gain.linearRampToValueAtTime(0.01, chordStart + chordDuration);
                osc.connect(gain);
                osc.start(chordStart);
                osc.stop(chordStart + chordDuration);
                this.scheduledNodes.push(osc);
            });

            // 旋律音符（每個和弦中播放 4 個 0.5 秒的音符）
            const melody = melodies[chordIdx];
            melody.forEach((freq, noteIdx) => {
                const noteStart = chordStart + noteIdx * 0.5;
                const osc = ctx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, noteStart);
                const gain = ctx.createGain();
                gain.connect(this.masterGain);
                gain.gain.setValueAtTime(0.01, noteStart);
                gain.gain.linearRampToValueAtTime(0.5, noteStart + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, noteStart + 0.45);
                osc.connect(gain);
                osc.start(noteStart);
                osc.stop(noteStart + 0.48);
                this.scheduledNodes.push(osc);
            });
        });

        // 8 秒後循環
        const totalDuration = chords.length * chordDuration;
        this.loopTimer = setTimeout(() => {
            this.scheduledNodes = [];
            this._playLoop();
        }, totalDuration * 1000 - 100); // 稍微提前排程避免間隙
    }

    stop() {
        this.isPlaying = false;
        if (this.loopTimer) {
            clearTimeout(this.loopTimer);
            this.loopTimer = null;
        }
        this.scheduledNodes.forEach(node => {
            try { node.stop(); } catch (e) { /* already stopped */ }
        });
        this.scheduledNodes = [];
    }

    setVolume(vol) {
        this.volume = vol;
        this.masterGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.1);
    }
}

// ─── React Hook ──────────────────────────────────────

export default function useAudio() {
    const [isMuted, setIsMuted] = useState(false);
    const bgmRef = useRef(null);
    const mutedRef = useRef(false);

    // 同步 ref 與 state
    useEffect(() => {
        mutedRef.current = isMuted;
        if (bgmRef.current) {
            bgmRef.current.setVolume(isMuted ? 0 : 0.08);
        }
    }, [isMuted]);

    // unmount 時清理
    useEffect(() => {
        return () => {
            if (bgmRef.current) {
                bgmRef.current.stop();
                bgmRef.current = null;
            }
        };
    }, []);

    const startBGM = useCallback(() => {
        const ctx = resumeAudioCtx();
        if (!bgmRef.current) {
            bgmRef.current = new BGMEngine(ctx);
        }
        if (!mutedRef.current) {
            bgmRef.current.start();
        }
    }, []);

    const stopBGM = useCallback(() => {
        if (bgmRef.current) {
            bgmRef.current.stop();
        }
    }, []);

    const playCorrect = useCallback(() => {
        if (mutedRef.current) return;
        const ctx = resumeAudioCtx();
        playCorrectSound(ctx);
    }, []);

    const playWrong = useCallback(() => {
        if (mutedRef.current) return;
        const ctx = resumeAudioCtx();
        playWrongSound(ctx);
    }, []);

    const playClick = useCallback(() => {
        if (mutedRef.current) return;
        const ctx = resumeAudioCtx();
        playClickSound(ctx);
    }, []);

    const playLevelUp = useCallback(() => {
        if (mutedRef.current) return;
        const ctx = resumeAudioCtx();
        playLevelUpSound(ctx);
    }, []);

    const playCombo = useCallback(() => {
        if (mutedRef.current) return;
        const ctx = resumeAudioCtx();
        playComboSound(ctx);
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const next = !prev;
            if (next) {
                // 靜音：停止背景音樂
                if (bgmRef.current) bgmRef.current.stop();
            } else {
                // 取消靜音：恢復背景音樂
                if (bgmRef.current) bgmRef.current.start();
            }
            return next;
        });
    }, []);

    return {
        isMuted,
        toggleMute,
        startBGM,
        stopBGM,
        playCorrect,
        playWrong,
        playClick,
        playLevelUp,
        playCombo,
    };
}
